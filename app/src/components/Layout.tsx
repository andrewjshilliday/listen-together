import React from 'react';
import { Header, NowPlaying, RoomBar } from './core';
import { useRoom } from './providers';
import styled from 'styled-components';

const Layout: React.FC = (props: any) => {
  const roomProvider = useRoom();
  if (!roomProvider.roomId) {
  return (<>{props.children}</>);
  }
  return (
    <>
      <Header></Header>
      <MainWrapper>
        {roomProvider.roomId && <RoomBar />}
        <MainContent id="main-content">{props.children}</MainContent>
      </MainWrapper>
      <NowPlaying></NowPlaying>
    </>
  );
}

export default Layout;


const MainWrapper = styled.div`
  display: flex;
`;
const MainContent = styled.main`
  height: calc(100vh - 175px);
  width: 100%;
  padding: 0 15px;
  overflow-x: hidden;
  overflow-y: scroll;
`;
