import React, { useEffect } from 'react';
import { useRoom } from '../../components/providers';
import { QueueMediaItemView } from '../../components/common';
import styled from 'styled-components';

const Room: React.FC = (props: any) => {
  const roomProvider = useRoom();

  useEffect(() => {
    if (!roomProvider.roomId) {
      /* props.history.push('/'); */
    }
  }, [roomProvider.roomId]);

  useEffect(() => {
    console.log(roomProvider.playlist);
  }, [roomProvider.playlist]);
  
  return (
    <RoomContainer>
      <h1>Room {props.match.params.id} User {roomProvider.username}</h1>
      {roomProvider.playlist.map((item: MusicKit.MediaItem, index: number) => (
        <QueueMediaItemView key={item.id} item={item} index={index}></QueueMediaItemView>
      ))}
    </RoomContainer>
  );
}

export default Room;


const RoomContainer = styled.div``;
