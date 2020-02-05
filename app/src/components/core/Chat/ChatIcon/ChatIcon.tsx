import React from 'react';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { useChat } from '../../../providers';
import styled from 'styled-components';

const ChatIcon: React.FC = (props: any) => {
  const chatProvider = useChat();

  return (
    <ChatIconContainer onClick={() => chatProvider.actions.toggleVisibility()} />
  );
}

export default ChatIcon;


const ChatIconContainer = styled(ChatBubbleIcon)`
  position: absolute;
  bottom: 0;
  right: 25px;
`;
