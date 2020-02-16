import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useChat } from '../../../providers';
import styled from 'styled-components';

const ChatInput: React.FC = (props: any) => {
  const chatProvider = useChat();
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    chatProvider.actions.sendMessage(message);
    setMessage('');
  }

  return (
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
  );
}

export default ChatInput;


const InputContainer = styled.div`
  height: 55px;
  margin: 0 25px;
  border-top: 1px solid #ccc;
  >div {
    width: 100%;
    >div button {
      :hover { color: var(--primary); }
    }
  }
`;
