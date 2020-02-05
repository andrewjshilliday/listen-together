import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { MusicKitProvider, AuthorizationProvider, RoomProvider, WebSocketProvider, ChatProvider } from './providers';
import { Home, Room, Search, Artist, Album, Playlist } from '../routes';
import Layout from './Layout';

const App: React.FC = () => {
  return (
    <WebSocketProvider>
      <MusicKitProvider>
        <AuthorizationProvider>
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
        </AuthorizationProvider>
      </MusicKitProvider>
    </WebSocketProvider>
  );
}

export default App;
