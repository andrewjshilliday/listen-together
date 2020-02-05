import React, { useEffect } from 'react';
import { useRoom } from '../../components/providers';
import { QueueMediaItemView } from '../../components/common';
import styled from 'styled-components';

const Room: React.FC = (props: any) => {
  const roomProvider = useRoom();

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
        <ChatContainer></ChatContainer>
      </RoomContainer>
    </>
  );
}

export default Room;


const Header = styled.h1``;
const RoomContainer = styled.div`
  display: flex;
`;
const QueueContainer = styled.div`
  width: 60%;
`;
const ChatContainer = styled.div`
  width: 40%;
`;
