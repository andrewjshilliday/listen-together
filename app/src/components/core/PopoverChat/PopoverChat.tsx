import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { Badge } from 'antd';
import { ChatBox } from '../../common';
import { ApplicationState } from '../../../store';
import { setPopoverBoxVisibility } from '../../../store/chat';
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

const PopoverChat: React.FC = (props: any) => {
  const popoverChatBoxVisible = useSelector((state: ApplicationState) => state.chat.popoverChatBoxVisible);
  const popoverChatIconVisible = useSelector((state: ApplicationState) => state.chat.popoverChatIconVisible);
  const unreadMessageCount = useSelector((state: ApplicationState) => state.chat.unreadMessageCount);
  const dispatch = useDispatch();
  const wrapperRef = useRef<HTMLDivElement>(null);
  useCloseChatBox(wrapperRef);

  return (
    <>
      <ChatIconContainer visible={popoverChatIconVisible}
        onClick={() => dispatch(setPopoverBoxVisibility(!popoverChatBoxVisible))}>
        <StyledBadge count={unreadMessageCount}><ChatBubbleIcon /></StyledBadge>
      </ChatIconContainer>
      <ChatBoxContainer ref={wrapperRef} visible={popoverChatBoxVisible}>
        <ChatBox />
      </ChatBoxContainer>
    </>
  );
}

export default PopoverChat;


const ChatIconContainer = styled.div<{visible: boolean}>`
  ${props => !props.visible && `
    display: none;
  `}
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
const ChatBoxContainer = styled.div<{visible: boolean}>`
  ${props => !props.visible && `
    display: none;
  `}
  ${props => props.visible && `
    display: flex;
  `}
  background: white;
  position: absolute;
  bottom: 40px;
  right: 25px;
  height: 500px;
  width: 500px;
  border: 1px solid black;
  border-radius: 2em;
  overflow: hidden;
`;
