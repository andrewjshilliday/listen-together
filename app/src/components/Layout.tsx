import React from 'react';
import { Redirect } from 'react-router-dom';
import { Header, NowPlaying, RoomBar, Chat } from './core';
import { useRoom } from './providers';
import styled from 'styled-components';

const Layout: React.FC = (props: any) => {
  const roomProvider = useRoom();

  if (!roomProvider.roomId) {
    if (window.location.pathname !== '/') return (<Redirect to='/' />);
    return (<>{props.children}</>);
  }
  return (
    <>
      <Header></Header>
      <MainWrapper>
        {roomProvider.roomId && <RoomBar />}
        <MainContent id="main-content">{props.children}</MainContent>
        {roomProvider.roomId && <ChatContainer />}
      </MainWrapper>
      <NowPlaying></NowPlaying>
    </>
  );
}

export default Layout;


const MainWrapper = styled.div`
  display: flex;
  position: relative;
`;
const MainContent = styled.main`
  height: calc(100vh - 175px);
  width: 100%;
  padding: 0 15px;
  overflow-x: hidden;
  overflow-y: scroll;
`;
const ChatContainer = styled(Chat)``;
