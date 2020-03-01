import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { Message, ChatInput, OnlineUsers } from '../../../common';
import { ApplicationState } from '../../../../store';
import { setPopoverBoxVisibility } from '../../../../store/chat';
import styled from 'styled-components';

const useCloseChatBox = (ref: React.RefObject<HTMLDivElement>) => {
  const popoverBoxVisible = useSelector((state: ApplicationState) => state.chat.popoverChatBoxVisible);
  const dispatch = useDispatch();

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref!.current.contains(event.target) && popoverBoxVisible) {
      dispatch(setPopoverBoxVisibility(false));
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
  const messages = useSelector((state: ApplicationState) => state.chat.messages);
  const username = useSelector((state: ApplicationState) => state.room.username);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const messagesContainer = useRef<HTMLDivElement>(null);
  useCloseChatBox(wrapperRef);

  useEffect(() => {
    const element = messagesContainer.current?.firstElementChild?.firstElementChild;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  return (
    <ChatBoxContainer>
      <OnlineUsers />
      <MessagesContainer ref={messagesContainer}>
        <StyledScrollbar>
          {messages.map((message, i) => <Message key={i} message={message} name={username ?? ''}/>)}
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
