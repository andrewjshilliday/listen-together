import React, { createContext, useContext, useState, useEffect, useReducer } from 'react'
import { useMusicKit } from '../providers';
declare const MusicKit: any;

interface RoomProviderState {
  roomId?: string,
  playlist: any[],
  addToPlaylist: (item: any) => void,
  setRoomId: (id: string) => void
}

const RoomContext = createContext({} as RoomProviderState);

const initState: RoomProviderState = {
  playlist: [],
  addToPlaylist: () => {},
  setRoomId: () => {}
};

const reducer = (prevState: any, updatedProperties: any) => ({
  ...prevState,
  ...updatedProperties,
});

export const RoomProvider = (props: any) => {

  const musicKitProvider = useMusicKit();
  const [state, setState] = useReducer(reducer, initState);

  const setRoomId = (id: string) => {
    setState({roomId: id});
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
      setRoomId: setRoomId
    });

    musicKitProvider.musicKit.addEventListener(MusicKit.Events.queueItemsDidChange, queueItemsDidChange);
    return () => { musicKitProvider.musicKit.removeEventListener(MusicKit.Events.queueItemsDidChange, queueItemsDidChange); };
  }, []);

  const queueItemsDidChange = () => {
    console.log('queueItemsDidChange');
    setState({playlist: musicKitProvider.musicKit.player.queue.items});
  };

  /* const initState: RoomProviderState = {
    playlist: [],
    addToPlaylist: addToPlaylist,
    setRoomId: setRoomId
  }; */

  /* const [state, setState] = useReducer(reducer, {} as RoomProviderState); */

  return (
    <RoomContext.Provider value={state}>
      {props.children}
    </RoomContext.Provider>
  );

}

export const useRoom = () => {
  return useContext(RoomContext);
}
