import React, { createContext, useContext, useState, useEffect, useReducer } from 'react'
import { useMusicKit } from '../providers';
import io from 'socket.io-client';
declare const MusicKit: any;

interface RoomProviderState {
  roomId?: string,
  playlist: any[],
  addToPlaylist: (item: any) => void,
  createRoom: () => void,
  joinRoom: (id: string) => void
}

const RoomContext = createContext({} as RoomProviderState);
let socket: SocketIOClient.Socket;

const initState: RoomProviderState = {
  playlist: [],
  addToPlaylist: () => {},
  createRoom: () => {},
  joinRoom: () => {}
};

const reducer = (prevState: any, updatedProperties: any) => ({
  ...prevState,
  ...updatedProperties,
});

export const RoomProvider = (props: any) => {

  const musicKitProvider = useMusicKit();
  const [state, setState] = useReducer(reducer, initState);
  const ENDPOINT = 'localhost:8002';

  const setRoomId = (id: string) => {
    setState({roomId: id});
  };

  const createRoom = () => {
    socket.emit('create', { name: 'test' }, ({ roomId, error }: any) => {
      if (error) {
        console.log(error);
        return;
      }
      setState({roomId: roomId});
    })
  };

  const joinRoom = (id: string) => {
    socket.emit('join', { name: 'test1', roomId: id }, ({ roomId, error }: any) => {
      if (error) {
        console.log(error);
        return;
      }
      setState({roomId: roomId});
    });
  }

  const addToPlaylist = async (item: any) => {
    if (musicKitProvider.musicKit.player.queue.items.length === 0) {
      await musicKitProvider.musicKit.setQueue({ [item.attributes.playParams.kind]: item.attributes.playParams.id });
      musicKitProvider.play();
    } else {
      musicKitProvider.musicKit.player.queue.append(item);
    }
  };

  useEffect(() => {
    setState({
      playlist: [],
      addToPlaylist: addToPlaylist,
      createRoom: createRoom,
      joinRoom: joinRoom
    });

    socket = io(ENDPOINT);
    musicKitProvider.musicKit.addEventListener(MusicKit.Events.queueItemsDidChange, queueItemsDidChange);
    return () => { musicKitProvider.musicKit.removeEventListener(MusicKit.Events.queueItemsDidChange, queueItemsDidChange); };
  }, []);

  const queueItemsDidChange = () => {
    console.log('queueItemsDidChange');
    setState({playlist: musicKitProvider.musicKit.player.queue.items});
  };

  return (
    <RoomContext.Provider value={state}>
      {props.children}
    </RoomContext.Provider>
  );

}

export const useRoom = () => {
  return useContext(RoomContext);
}
