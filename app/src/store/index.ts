import { combineReducers } from 'redux'
import { all, fork } from 'redux-saga/effects'
import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'

import { MusicKitState, musicKitReducer, musicKitSaga } from './musicKit';
import { AuthenticationState, authenticationReducer, authenticationSaga } from './authentication';
import { WebsocketState, websocketReducer, websocketSaga } from './websocket';

export interface ApplicationState {
  musicKit: MusicKitState
  authentication: AuthenticationState
  websocket: WebsocketState
  router: RouterState
}

export const createRootReducer = (history: History) => 
  combineReducers({
    musicKit: musicKitReducer,
    authentication: authenticationReducer,
    websocket: websocketReducer,
    router: connectRouter(history)
  });

export function* rootSaga() {
  yield all([fork(musicKitSaga), fork(authenticationSaga), fork(websocketSaga)]);
}