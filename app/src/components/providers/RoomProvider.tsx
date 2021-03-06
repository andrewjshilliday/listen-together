import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import { useMusicKit, useWebSocket } from '../providers';
import { ListenTogetherApiService } from '../../services';

interface RoomProviderState {
  roomId?: string
  username?: string
  playlist: MusicKit.MediaItem[]
  currentSong: any
  users: User[]
  playbackCountdown?: number
  actions: IActions
}

interface IActions {
  createUser: Function
  addToPlaylist: Function
  createRoom: Function
  joinRoom: Function
}

interface User {
  name: string
  id: string
  color: string
}

const RoomContext = createContext({} as RoomProviderState)

const initState: RoomProviderState = {
  playlist: [],
  users: [],
  currentSong: null,
  actions: {
    createUser: () => {},
    addToPlaylist: () => {},
    createRoom: () => {},
    joinRoom: () => {}
  }
}

const reducer = (prevState: RoomProviderState, updatedProperties: any): RoomProviderState => ({
  ...prevState,
  ...updatedProperties,
})

export const RoomProvider = (props: any) => {

  const [state, setState] = useReducer(reducer, initState);
  const webSocketProvider = useWebSocket();
  const musicKitProvider = useMusicKit();
  const stateRef= useRef<RoomProviderState>({} as RoomProviderState);

  const createUser = (name: string) => {
    setState({ username: name });
  };

  const createRoom = (callback: any) => {
    webSocketProvider.socket.emit('create', { name: stateRef.current.username }, ({ roomId, error }: any) => {
      if (error) {
        console.log(error);
        return;
      }
      setState({ roomId: roomId });
      callback(roomId);
    })
  };

  const joinRoom = (id: string, callback: any) => {
    webSocketProvider.socket.emit('join', { name: stateRef.current.username, roomId: id.trim() }, async ({ roomId, playlist, error }: any) => {
      if (error) {
        console.log(error);
        return;
      }
      setState({ roomId: roomId, playlist: playlist });
      callback(roomId);

      if (playlist && playlist.length) {
        // fix this. need to set multiple items at once, set queue position and playback time
        await musicKitProvider.musicKit.setQueue({ [playlist[0].attributes.playParams.kind]: playlist[0].attributes.playParams.id });
        for (let i = 1; i < playlist.length; i++) {
          musicKitProvider.musicKit.player.queue.append(playlist[i]);
        }
        
        webSocketProvider.socket.emit('playbackInfo', { action: 'request', username: stateRef.current.username });
      }
    });
  };

  const addToPlaylist = async (item: MusicKit.MediaItem) => {
    webSocketProvider.actions.sendAction('addToPlaylist', item);
  };

  const queueItemsDidChange = () => {
    console.log('queueItemsDidChange');
    setState({ playlist: musicKitProvider.musicKit.player.queue.items });
  };

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const retrieveSong = async () => {
      const song = await ListenTogetherApiService.GeniusSong(
        musicKitProvider.nowPlayingItem!.artistName,
        musicKitProvider.nowPlayingItem!.attributes.name,
        true);
      
      setState({ ...state, currentSong: song });
    }
    
    if (musicKitProvider.nowPlayingItem) { retrieveSong(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicKitProvider.nowPlayingItem])

  useEffect(() => {
    setState({
      actions: {
        createUser: createUser,
        addToPlaylist: addToPlaylist,
        createRoom: createRoom,
        joinRoom: joinRoom
      }
    });

    webSocketProvider.socket.on('action', async ({ action, user, data }: any) => {
      switch (action) {
        case 'addToPlaylist':
          if (musicKitProvider.musicKit.player.queue.items.length === 0) {
            await musicKitProvider.musicKit.setQueue({ [data.attributes.playParams.kind]: data.attributes.playParams.id });
            musicKitProvider.actions.play();
          } else {
            musicKitProvider.musicKit.player.queue.append(data);
          }
          break;
      }
    });

    webSocketProvider.socket.on('playbackInfo', async ({ action, username, data }: any) => {
      if (action === 'request' && username !== stateRef.current.username) {
        webSocketProvider.socket.emit('playbackInfo', {
          action: 'send',
          username: username,
          data: {
            queuePosition: musicKitProvider.musicKit.player.queue.position,
            playbackTime: musicKitProvider.musicKit.player.currentPlaybackTimeRemaining
          }
        });
      }
      if (action === 'send' && username === stateRef.current.username) {
        if (data.queuePosition) {
          await musicKitProvider.musicKit.changeToMediaAtIndex(data.queuePosition);
        }
        if (data.playbackTime) {
          
          setState({ playbackCountdown: data.playbackTime });
          setTimeout(() => {
            musicKitProvider.musicKit.player.play();
          }, data.playbackTime * 1000);
          const countdown = setInterval(() => {
            setState({ playbackCountdown: stateRef.current.playbackCountdown! - 1 });
            if (stateRef.current.playbackCountdown! <= 0) {
              clearInterval(countdown);
            }
          }, 1000);
        }
      };
    });

    webSocketProvider.socket.on('roomData', ({ room, users }: any) => {
      console.log(users.filter((user: User) => user.name !== stateRef.current.username));
      setState({ users: users.filter((user: User) => user.name !== stateRef.current.username) });
    });

    musicKitProvider.musicKit.addEventListener('queueItemsDidChange', queueItemsDidChange);
    return () => { musicKitProvider.musicKit.removeEventListener('queueItemsDidChange', queueItemsDidChange); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RoomContext.Provider value={state}>
      {props.children}
    </RoomContext.Provider>
  );

}

export const useRoom = () => {
  return useContext(RoomContext);
}
