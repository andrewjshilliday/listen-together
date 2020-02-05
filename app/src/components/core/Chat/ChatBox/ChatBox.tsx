import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useChat, useRoom } from '../../../providers';
import { Message } from '../../../core';
import styled from 'styled-components';

const ChatBox: React.FC = (props: any) => {
  const chatProvider = useChat();
  const roomProvider = useRoom();
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    console.log(message);
    chatProvider.actions.sendMessage(message);
  }

  return (
    <ChatBoxContainer visible={chatProvider.chatBoxVisible}>
      <MessagesContainer>
        {chatProvider.messages.map((message, i) => <Message key={i} message={message} name={roomProvider.username ?? ''}/>)}
      </MessagesContainer>
      <InputContainer>
        <TextField label="Type a message" onChange={(e) => setMessage(e.target.value)}
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
  bottom: 25px;
  right: 25px;
  height: 500px;
  width: 500px;
  border: 1px solid black;
  border-radius: 2em;
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
  >div { width: 100%; }
`;
