import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QueueMediaItemView, ChatBox } from '../../components/common';
import { ApplicationState } from '../../store';
import { setPopoverIconVisibility } from '../../store/chat';
import styled from 'styled-components';

const Room: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const playlist = useSelector((state: ApplicationState) => state.room.playlist);
  const roomId = useSelector((state: ApplicationState) => state.room.roomId);
  const username = useSelector((state: ApplicationState) => state.room.username);

  useEffect(() => {
    dispatch(setPopoverIconVisibility(false));
    return () => { dispatch(setPopoverIconVisibility(true)); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!roomId) {
      props.history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    console.log(playlist);
  }, [playlist]);
  
  return (
    <>
      <Header>Room {props.match.params.id} User {username}</Header>
      <RoomContainer>
        <QueueContainer>
          {playlist.map((item: MusicKit.MediaItem, index: number) => (
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
