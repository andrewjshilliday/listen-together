import React, { useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import { History } from 'history'
import { MusicKitProvider, RoomProvider, WebSocketProvider, ChatProvider } from './providers';
import { Home, Room, Search, Artist, Album, Playlist } from '../routes';
import Layout from './Layout';
import { setMusicKitInstance } from '../store/musicKit';
import { setAuthenticated } from '../store/authentication';
import { connect } from '../store/websocket';

const App: React.FC = () => {
  console.log(process.env.NODE_ENV);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMusicKitInstance());
    dispatch(setAuthenticated());
    dispatch(connect());
  }, []);

  return (
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
  );
}

export default App;
