import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlaylist } from '../../store/room';
import { ApplicationState } from '../../store';
import { setNowPlayingItem, setIsPlaying, setPlaybackLoading, setPlaybackTime } from '../../store/musicKit';

interface RoomProviderState {
  roomId?: string
  username?: string
  playlist: MusicKit.MediaItem[]
  users: User[]
  playbackCountdown?: number
  actions: IActions
}

interface IActions {
  createUser: (name: string) => void
  addToPlaylist: (item: MusicKit.MediaItem) => void
  createRoom: (callback: any) => void
  joinRoom: (id: string, callback: any) => void
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

  const dispatch = useDispatch();
  const musicKitInstance = useSelector((state: ApplicationState) => state.musicKit.musicKitInstance);
  const [state, setState] = useReducer(reducer, initState);
  const stateRef= useRef<RoomProviderState>({} as RoomProviderState);

  const createUser = (name: string) => {
    /* setState({ username: name }); */
  };

  const createRoom = (callback: any) => {
    /* webSocketProvider.socket.emit('create', { name: stateRef.current.username }, ({ roomId, error }: any) => {
      if (error) {
        console.log(error);
        return;
      }
      setState({ roomId: roomId });
      callback(roomId);
    }) */
  };

  const joinRoom = (id: string, callback: any) => {
    /* webSocketProvider.socket.emit('join', { name: stateRef.current.username, roomId: id.trim() }, async ({ roomId, playlist, error }: any) => {
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
    }); */
  };

  const addToPlaylist = async (item: MusicKit.MediaItem) => {
    /* webSocketProvider.actions.sendAction('addToPlaylist', item); */
  };

  const queueItemsDidChange = () => {
    console.log('queueItemsDidChange');
    dispatch(setPlaylist(musicKitInstance?.player.queue.items));
    /* setState({ playlist: musicKitProvider.musicKit.player.queue.items }); */
  };

  const mediaItemDidChange = (event: any) => {
    console.log(`mediaItemDidChange`);
    dispatch(setNowPlayingItem(event.item));
  }

  const playbackStateDidChange = (event: any) => {
    console.log(`playbackStateDidChange`);
    dispatch(setIsPlaying(event.state === 2));
    dispatch(setPlaybackLoading(event.state === 1 || event.state === 8));
    /* this.setState({
      isPlaying: event.state === 2,
      playbackLoading: event.state === 1 || event.state === 8
    }); */
  }

  const playbackTimeDidChange = () => {
    dispatch(setPlaybackTime({
      playbackTime: musicKitInstance?.player.currentPlaybackTime,
      playbackTimeRemaining: musicKitInstance?.player.currentPlaybackTimeRemaining
    }));
    /* this.setState({
      currentPlaybackTime: this.state.musicKit.player.currentPlaybackTime,
      currentPlaybackTimeRemaining: this.state.musicKit.player.currentPlaybackTimeRemaining
    }); */
  }

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    /* setState({
      actions: {
        createUser: createUser,
        addToPlaylist: addToPlaylist,
        createRoom: createRoom,
        joinRoom: joinRoom
      }
    }); */

    /* webSocketProvider.socket.on('action', async ({ action, user, data }: any) => {
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
    }); */

    /* webSocketProvider.socket.on('playbackInfo', async ({ action, username, data }: any) => {
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
    }); */

    /* webSocketProvider.socket.on('roomData', ({ room, users }: any) => {
      console.log(users.filter((user: User) => user.name !== stateRef.current.username));
      setState({ users: users.filter((user: User) => user.name !== stateRef.current.username) });
    }); */

    if (musicKitInstance) {
      musicKitInstance.addEventListener('mediaItemDidChange', mediaItemDidChange);
      musicKitInstance.addEventListener('playbackStateDidChange', playbackStateDidChange);
      musicKitInstance.addEventListener('playbackTimeDidChange', playbackTimeDidChange);
      musicKitInstance.addEventListener('queueItemsDidChange', queueItemsDidChange);
    }
    return () => {
      if (musicKitInstance) {
        musicKitInstance.removeEventListener('mediaItemDidChange', mediaItemDidChange);
        musicKitInstance.removeEventListener('playbackStateDidChange', playbackStateDidChange);
        musicKitInstance.removeEventListener('playbackTimeDidChange', playbackTimeDidChange);
        musicKitInstance.removeEventListener('queueItemsDidChange', queueItemsDidChange);
      }
    };
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
