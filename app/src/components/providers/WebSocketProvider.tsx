import React, { createContext, useContext, useState } from 'react'
import io from 'socket.io-client';

export interface WebSocketProviderState {
  socket: SocketIOClient.Socket
  actions: IActions
}

interface IActions {
  sendAction: Function
  sendMessage: Function
}

export const WebSocketContext = createContext({} as WebSocketProviderState);

export const WebSocketProvider = (props: any) => {

  const sendAction = (action: string, data?: any) => {
    state.socket.emit('sendAction', { action, data }, ({ error }: any) => {
      if (error) {
        console.log(error);
      }
    });
  };

  const sendMessage = (message: string) => {
    state.socket.emit('sendMessage', { message }, ({ error }: any) => {
      if (error) {
        console.log(error);
      }
    });
  };

  const [state] = useState({ 
    socket: io(process.env.REACT_APP_SOCKETIO_URL!.toString()),
    actions: {
      sendAction: sendAction,
      sendMessage: sendMessage
    }
  });

  return (
    <WebSocketContext.Provider value={state}>
      {props.children}
    </WebSocketContext.Provider>
  );

}

export const useWebSocket = () => {
  return useContext(WebSocketContext);
}
