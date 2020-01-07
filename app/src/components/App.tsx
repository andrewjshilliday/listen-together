import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { MusicKitProvider, AuthorizationProvider, RoomProvider } from './providers';
import { Home, Room, Search, Artist, Album, Playlist } from '../routes';
import Layout from './Layout';

const App: React.FC = () => {
  return (
    <MusicKitProvider>
      <AuthorizationProvider>
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
      </AuthorizationProvider>
    </MusicKitProvider>
  );
}

export default App;
