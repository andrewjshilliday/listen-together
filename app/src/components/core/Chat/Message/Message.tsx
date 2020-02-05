import React from 'react';
import { useChat } from '../../../providers';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';

interface MessageProps {
  message: any,
  name: string
}

const Message: React.FC<MessageProps> = ({ message, name }) => {
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();

  if(message.user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    <MessageContainer isSentByCurrentUser={isSentByCurrentUser}>
      {!isSentByCurrentUser && <Username>{name}</Username>}
      <MessageText isSentByCurrentUser={isSentByCurrentUser}>{message.text}</MessageText>
    </MessageContainer>
  );
}

export default Message;


const MessageContainer = styled.div<{isSentByCurrentUser: boolean}>`
  display: flex;
  flex-direction: column;
  max-width: 75%;
  min-width: 50%;
  ${props => props.isSentByCurrentUser && `
    align-self: flex-end;
  `}
`;
const Username = styled.div`
  margin: 5px 15px 0 30px;
  font-size: 10pt;
  color: gray;
`;
const MessageText = styled.div<{isSentByCurrentUser: boolean}>`
  padding: 10px;
  color: white;
  border-radius: 2em;
  ${props => props.isSentByCurrentUser && `
    margin: 10px;
    background: blue;
  `}
  ${props => !props.isSentByCurrentUser && `
    margin: 3px 10px 10px 10px;
    background: green;
  `}
`;
