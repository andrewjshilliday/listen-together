import React, { useEffect } from 'react';
import { useRoom, useChat } from '../../components/providers';
import { QueueMediaItemView, ChatBox } from '../../components/common';
import styled from 'styled-components';

const Room: React.FC = (props: any) => {
  const roomProvider = useRoom();
  const chatProvider = useChat();

  useEffect(() => {
    chatProvider.actions.setPopoverChatIconVisibility(false);
    return () => { chatProvider.actions.setPopoverChatIconVisibility(true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!roomProvider.roomId) {
      props.history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomProvider.roomId]);

  useEffect(() => {
    console.log(roomProvider.playlist);
  }, [roomProvider.playlist]);
  
  return (
    <>
      <Header>Room {props.match.params.id} User {roomProvider.username}</Header>
      <RoomContainer>
        <QueueContainer>
          {roomProvider.playlist.map((item: MusicKit.MediaItem, index: number) => (
            <QueueMediaItemView key={item.id} item={item} index={index}></QueueMediaItemView>
          ))}
        </QueueContainer>
        <ChatContainer>
          <ChatBox></ChatBox>
        </ChatContainer>
      </RoomContainer>
    </>
  );
}

export default Room;


const Header = styled.h1``;
const RoomContainer = styled.div`
  display: flex;
  height: calc(100% - 44px);
`;
const QueueContainer = styled.div`
  width: 60%;
`;
const ChatContainer = styled.div`
  width: 40%;
`;
