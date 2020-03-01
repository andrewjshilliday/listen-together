import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import styled from 'styled-components';
import { sendMessage } from '../../../../store/chat';

const ChatInput: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  const dispatchSendMessage = () => {
    dispatch(sendMessage(message));
    setMessage('');
  }

  return (
    <InputContainer>
      <TextField label="Type a message" value={message} onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            dispatchSendMessage();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => dispatchSendMessage()}>
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
