import React, { useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
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
  
  return (
    <>
      <Header>Room {props.match.params.id} User {roomProvider.username}</Header>
      <RoomContainer>
        <StyledQueue>
          <QueueContainer>
            {roomProvider.playlist.map((item: MusicKit.MediaItem, index: number) => (
              <QueueMediaItemView key={item.id} item={item} index={index}></QueueMediaItemView>
            ))}
          </QueueContainer>
          {roomProvider.currentSong?.lyrics &&
            <LyricsContainer>
              <h2>{roomProvider.currentSong.title} Lyrics</h2>
              <pre>{roomProvider.currentSong.lyrics}</pre>
            </LyricsContainer>}
        </StyledQueue>
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
const StyledQueue = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;
const QueueContainer = styled(Scrollbars)``;
const LyricsContainer = styled(Scrollbars)`
  max-height: 40%;
  margin: 1em 0;
  h2, pre { margin: 0 1rem; }
  h2 {
    position: sticky;
    top: 0;
    background: white;
  }
`;
const ChatContainer = styled.div`
  width: 40%;
`;
