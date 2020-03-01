import React, { useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import { History } from 'history'
import { RoomProvider } from './providers';
import { Home, Room, Search, Artist, Album, Playlist } from '../routes';
import Layout from './Layout';
import { setMusicKitInstance } from '../store/musicKit';
import { setAuthenticated } from '../store/authentication';
import { connect } from '../store/websocket';
import { Secrets } from '../secrets';
declare const MusicKit: any;

const App: React.FC = () => {
  console.log(process.env.NODE_ENV);
  const dispatch = useDispatch();

  useEffect(() => {
    MusicKit.configure({
      developerToken: Secrets.appleMusicDevToken,
      app: {
        name: 'ListenTogether',
        build: '0.1',
        version: '0.1',
      }
    });
    dispatch(setMusicKitInstance());
    dispatch(setAuthenticated());
    dispatch(connect());
  }, []);

  return (
    <RoomProvider>
      <Router>
        <Layout>
          <Switch>
            <Route path={'/'} exact component={Home} />
            <Route path={'/room/:id'} component={Room} />
            <Route path={'/search/:query'} component={Search} />
            <Route path={'/artist/:id'} component={Artist} />
            <Route path={'/album/:id'} component={Album} />
            <Route path={'/playlist/:id'} component={Playlist} />
            <Redirect to={'/'} />
          </Switch>
        </Layout>
      </Router>
    </RoomProvider>
  );

  /* return (
    <WebSocketProvider>
      <MusicKitProvider>
        <RoomProvider>
          <ChatProvider>
            <Router>
              <Layout>
                <Switch>
                  <Route path={'/'} exact component={Home} />
                  <Route path={'/room/:id'} component={Room} />
                  <Route path={'/search/:query'} component={Search} />
                  <Route path={'/artist/:id'} component={Artist} />
                  <Route path={'/album/:id'} component={Album} />
                  <Route path={'/playlist/:id'} component={Playlist} />
                  <Redirect to={'/'} />
                </Switch>
              </Layout>
            </Router>
          </ChatProvider>
        </RoomProvider>
      </MusicKitProvider>
    </WebSocketProvider>
  ); */
}

export default App;
