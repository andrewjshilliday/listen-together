import React from 'react';
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
      {!isSentByCurrentUser && <Username>{message.user}</Username>}
      <MessageText isSentByCurrentUser={isSentByCurrentUser}>{message.text}</MessageText>
    </MessageContainer>
  );
}

export default Message;


const MessageContainer = styled.div<{isSentByCurrentUser: boolean}>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  max-width: 75%;
  min-width: 50%;
  overflow: hidden;
  ${props => props.isSentByCurrentUser && `
    align-self: flex-end;
  `}
`;
const Username = styled.div`
  margin: 0 15px 0 30px;
  font-size: 10pt;
  color: gray;
`;
const MessageText = styled.div<{isSentByCurrentUser: boolean}>`
  padding: 10px;
  color: white;
  ${props => props.isSentByCurrentUser && `
    border-radius: 2em 2em 0 2em;
    margin: 3px 10px;
    background: blue;
  `}
  ${props => !props.isSentByCurrentUser && `
    border-radius: 2em 2em 2em 0;
    margin: 3px 10px 3px 10px;
    background: green;
  `}
`;
