import React, { useRef, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useChat, useRoom } from '../../../providers';
import { Message, ChatInput, OnlineUsers } from '../../../common';
import styled from 'styled-components';

const useCloseChatBox = (ref: React.RefObject<HTMLDivElement>) => {
  const chatProvider = useChat();

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref!.current.contains(event.target) && chatProvider.popoverChatBoxVisible) {
      chatProvider.actions.setPopoverChatBoxVisibility(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  });
}

const ChatBox: React.FC = (props: any) => {
  const chatProvider = useChat();
  const roomProvider = useRoom();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const messagesContainer = useRef<HTMLDivElement>(null);
  useCloseChatBox(wrapperRef);

  useEffect(() => {
    const element = messagesContainer.current?.firstElementChild?.firstElementChild;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [chatProvider.messages]);

  return (
    <ChatBoxContainer>
      <OnlineUsers />
      {/* {roomProvider.users.length > 0 && } */}
      <MessagesContainer ref={messagesContainer}>
        <StyledScrollbar>
          {chatProvider.messages.map((message, i) => <Message key={i} message={message} name={roomProvider.username ?? ''}/>)}
        </StyledScrollbar>
      </MessagesContainer>
      <ChatInput />
    </ChatBoxContainer>
  );
}

export default ChatBox;


const ChatBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* flex-grow: 1; */
  height: 100%;
  width: 100%;
`;
const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: auto;
`;
const StyledScrollbar = styled(Scrollbars)`
  >div {
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;
  }
`;
