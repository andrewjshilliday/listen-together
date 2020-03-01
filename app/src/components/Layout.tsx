import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Header, NowPlaying, RoomBar, PopoverChat } from './core';
import { ApplicationState } from '../store';
import styled from 'styled-components';

const Layout: React.FC = (props: any) => {
  const roomId = useSelector((state: ApplicationState) => state.room.roomId);

  if (!roomId) {
    if (window.location.pathname !== '/') return (<Redirect to='/' />);
    return (<>{props.children}</>);
  }
  return (
    <>
      <Header></Header>
      <MainWrapper>
        <RoomBar />
        <MainContent id="main-content">{props.children}</MainContent>
        <PopoverChatContainer />
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
  display: flex;
  flex-direction: column;
  height: calc(100vh - 175px);
  width: 100%;
  padding: 0 15px;
  overflow-x: hidden;
  overflow-y: scroll;
`;
const PopoverChatContainer = styled(PopoverChat)``;
