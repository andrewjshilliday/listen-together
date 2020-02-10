import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import { useWebSocket } from '../providers';

export interface ChatProviderState {
  chatBoxVisible: boolean,
  messages: Message[],
  unreadMessageCount: number,
  actions: IActions
}

interface IActions {
  sendMessage: (message: string) => void,
  setVisibility: (visible: boolean) => void
}

interface Message {
  text: string,
  user: string
}

export const ChatContext = createContext({} as ChatProviderState);

const initState: ChatProviderState = {
  chatBoxVisible: false,
  messages: [],
  unreadMessageCount: 0,
  actions: {
    sendMessage: (message: string) => {},
    setVisibility: (visible: boolean) => {}
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
    if (!message) { return; }
    webSocketProvider.actions.sendMessage(message);
  };

  const setVisibility = (visible: boolean) => {
    setState({
      chatBoxVisible: visible,
      unreadMessageCount: visible ? 0 : stateRef.current.unreadMessageCount
    });
  }

  useEffect(() => {
    setState({
      actions: {
        sendMessage: sendMessage,
        setVisibility: setVisibility
      }
    });

    webSocketProvider.socket.on('message', (message: any) => {
      setState({
        messages: [...stateRef.current.messages, message],
        unreadMessageCount: stateRef.current.chatBoxVisible ? stateRef.current.unreadMessageCount : stateRef.current.unreadMessageCount + 1
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
