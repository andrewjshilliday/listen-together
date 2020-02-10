import React, { useState, useRef, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { Scrollbars } from 'react-custom-scrollbars';
import { useChat, useRoom } from '../../../providers';
import { Message } from '../../../core';
import styled from 'styled-components';

const useOutsideAlerter = (ref: React.RefObject<HTMLDivElement>) => {
  const chatProvider = useChat();

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref!.current.contains(event.target) && chatProvider.chatBoxVisible) {
      chatProvider.actions.setVisibility(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
}

const ChatBox: React.FC = (props: any) => {
  const chatProvider = useChat();
  const roomProvider = useRoom();
  const [message, setMessage] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef);

  const sendMessage = () => {
    chatProvider.actions.sendMessage(message);
    setMessage('');
  }

  return (
    <ChatBoxContainer ref={wrapperRef} visible={chatProvider.chatBoxVisible}>
      <MessagesContainer>
        <StyledScrollbar>
          {chatProvider.messages.map((message, i) => <Message key={i} message={message} name={roomProvider.username ?? ''}/>)}
        </StyledScrollbar>
      </MessagesContainer>
      <InputContainer>
        <TextField label="Type a message" value={message} onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => sendMessage()}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            )
          }} />
        </InputContainer>
    </ChatBoxContainer>
  );
}

export default ChatBox;


const ChatBoxContainer = styled.div<{visible: boolean}>`
  ${props => !props.visible && `
    display: none;
  `}
  background: white;
  position: absolute;
  bottom: 40px;
  right: 25px;
  height: 500px;
  width: 500px;
  border: 1px solid black;
  border-radius: 2em;
`;
const StyledScrollbar = styled(Scrollbars)`
  >div {
    display: flex;
    flex-direction: column;
  }
`;
const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 430px;
  overflow: auto;
`;
const InputContainer = styled.div`
  margin: 0 25px;
  border-top: 1px solid #ccc;
  >div {
    width: 100%;
    >div button {
      :hover { color: var(--primary); }
    }
  }
`;
