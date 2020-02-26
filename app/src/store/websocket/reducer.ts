import { Reducer } from 'redux';
import { WebsocketState, WebsocketActionTypes } from './types';

export const initialState: WebsocketState = {}

const reducer: Reducer<WebsocketState> = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

export { reducer as websocketReducer }
