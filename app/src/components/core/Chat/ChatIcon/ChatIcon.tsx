import React from 'react';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { Badge } from 'antd';
import { useChat } from '../../../providers';
import styled from 'styled-components';

const ChatIcon: React.FC = (props: any) => {
  const chatProvider = useChat();

  return (
    <ChatIconContainer onClick={() => chatProvider.actions.setVisibility(!chatProvider.chatBoxVisible)}>
      <StyledBadge count={chatProvider.unreadMessageCount}><ChatBubbleIcon /></StyledBadge>
    </ChatIconContainer>
  );
}

export default ChatIcon;


const ChatIconContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 50px;
  padding: 3px 7px;
  background: white;
  border: 1px solid #ccc;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
  :hover {
    color: var(--primary);
    cursor: pointer;
  }
`;
const StyledBadge = styled(Badge)`
  .ant-scroll-number-only-unit { line-height: 1.5; }
`;
