import React, { createContext, useContext, useState } from 'react'
import io from 'socket.io-client';

export interface WebSocketProviderState {
  socket: SocketIOClient.Socket
  actions: IActions
}

interface IActions {
  sendAction: (action: string, data?: any) => void
  sendMessage: (message: string) => void
}

export const WebSocketContext = createContext({} as WebSocketProviderState);

export const WebSocketProvider = (props: any) => {

  const sendAction = (action: string, data?: any) => {
    /* state.socket.emit('sendAction', { action, data }, ({ error }: any) => {
      if (error) {
        console.log(error);
      }
    }); */
  };

  const sendMessage = (message: string) => {
    /* state.socket.emit('sendMessage', { message }, ({ error }: any) => {
      if (error) {
        console.log(error);
      }
    }); */
  };

  /* const [state] = useState({
    socket: io(process.env.NODE_ENV === 'production' ? 'https://listen-together-server.herokuapp.com/' : 'localhost:8002'),
    actions: {
      sendAction: sendAction,
      sendMessage: sendMessage
    }
  }); */

  return (
    <>{props.children}</>
    /* <WebSocketContext.Provider value={state}>
      {props.children}
    </WebSocketContext.Provider> */
  );

}

export const useWebSocket = () => {
  return useContext(WebSocketContext);
}
