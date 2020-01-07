import React from 'react';
import { Header, NowPlaying, RoomBar } from './core';
import { useRoom } from './providers';

const mainContentStyle = {
  height: 'calc(100vh - 175px)',
  width: '100%',
  overflow: 'hidden',
}

const Layout: React.FC = (props: any) => {
  const roomProvider = useRoom();
  return (
    <>
      <Header></Header>
      <div id="main-wrapper" style={{display: 'flex'}}>
        {roomProvider.roomId && <RoomBar />}
        <main id="main-content" style={mainContentStyle}>{props.children}</main>
      </div>
      <NowPlaying></NowPlaying>
    </>
  );
}

export default Layout;
