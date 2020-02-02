import React, { createContext, useContext, useState } from 'react'
import io from 'socket.io-client';

export interface WebSocketProviderState {
  socket: SocketIOClient.Socket
  actions: IActions
}

interface IActions {
  sendAction: (action: string, data?: any) => void
}

export const WebSocketContext = createContext({} as WebSocketProviderState);

export const WebSocketProvider = (props: any) => {

  const sendAction = (action: string, data?: any) => {
    state.socket.emit('sendAction', { action, data }, ({ error }: any) => {
      console.log(error);
    });
  }

  const [state] = useState({ 
    socket: io('localhost:8002'),
    actions: {
      sendAction: sendAction
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
