import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import { useWebSocket } from '../providers';

export interface ChatProviderState {
  chatBoxVisible: boolean,
  messages: Message[],
  actions: IActions
}

interface IActions {
  sendMessage: (message: string) => void,
  toggleVisibility: () => void
}

interface Message {
  text: string,
  user: string
}

export const ChatContext = createContext({} as ChatProviderState);

const initState: ChatProviderState = {
  chatBoxVisible: false,
  messages: [],
  actions: {
    sendMessage: (message: string) => {},
    toggleVisibility: () => {}
  }
}

const reducer = (prevState: ChatProviderState, updatedProperties: any): ChatProviderState => ({
  ...prevState,
  ...updatedProperties,
})

export const ChatProvider = (props: any) => {

  const [state, setState] = useReducer(reducer, initState);  
  const webSocketProvider = useWebSocket();
  const stateRef = useRef<ChatProviderState>(state);

  const sendMessage = (message: string) => {
    webSocketProvider.actions.sendMessage(message);
  };

  const toggleVisibility = () => {
    setState({ chatBoxVisible: !stateRef.current.chatBoxVisible });
  }

  useEffect(() => {
    setState({
      actions: {
        sendMessage: sendMessage,
        toggleVisibility: toggleVisibility
      }
    });

    webSocketProvider.socket.on('message', (message: any) => {
      setState({ messages: [...stateRef.current.messages, message]});
    });
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return (
    <ChatContext.Provider value={state}>
      {props.children}
    </ChatContext.Provider>
  );

}

export const useChat = () => {
  return useContext(ChatContext);
}
