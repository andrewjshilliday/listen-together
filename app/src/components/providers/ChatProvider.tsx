import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import { useWebSocket } from '../providers';

export interface ChatProviderState {
  popoverChatBoxVisible: boolean
  popoverChatIconVisible: boolean
  messages: Message[]
  unreadMessageCount: number
  actions: IActions
}

interface IActions {
  sendMessage: Function
  setPopoverChatBoxVisibility: Function
  setPopoverChatIconVisibility: Function
}

interface Message {
  text: string
  user: string
}

export const ChatContext = createContext({} as ChatProviderState);

const initState: ChatProviderState = {
  popoverChatBoxVisible: false,
  popoverChatIconVisible: true,
  messages: [],
  unreadMessageCount: 0,
  actions: {
    sendMessage: (message: string) => {},
    setPopoverChatBoxVisibility: (visible: boolean) => {},
    setPopoverChatIconVisibility: (visible: boolean) => {}
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

  const setPopoverChatBoxVisibility = (visible: boolean) => {
    setState({
      popoverChatBoxVisible: visible,
      unreadMessageCount: visible ? 0 : stateRef.current.unreadMessageCount
    });
  }

  const setPopoverChatIconVisibility = (visible: boolean) => {
    setState({
      popoverChatIconVisible: visible
    });
  }

  useEffect(() => {
    setState({
      actions: {
        sendMessage: sendMessage,
        setPopoverChatBoxVisibility: setPopoverChatBoxVisibility,
        setPopoverChatIconVisibility: setPopoverChatIconVisibility
      }
    });

    webSocketProvider.socket.on('message', (message: any) => {
      setState({
        messages: [...stateRef.current.messages, message],
        unreadMessageCount: !stateRef.current.popoverChatIconVisible ? 0 :
          (stateRef.current.popoverChatBoxVisible ? stateRef.current.unreadMessageCount : stateRef.current.unreadMessageCount + 1)
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
