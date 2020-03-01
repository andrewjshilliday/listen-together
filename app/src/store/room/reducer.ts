import { Reducer } from 'redux';
import { RoomState, RoomActionTypes } from './types';

export const initialState: RoomState = {
  playlist: [],
  users: []
}

const reducer: Reducer<RoomState> = (state = initialState, action) => {
  switch (action.type) {
    case RoomActionTypes.SET_USER:
      return { ...state, username: action.payload };
    case RoomActionTypes.SET_ROOMID:
      return { ...state, roomId: action.payload };
    case RoomActionTypes.SET_PLAYLIST:
      return { ...state, playlist: action.payload };
    case RoomActionTypes.SET_USERSINROOM:
      return { ...state, users: action.payload };
    case RoomActionTypes.SET_PLAYBACKCOUNTDOWN:
      return { ...state, playbackCountdown: action.payload };
    default:
      return state;
  }
}

export { reducer as roomReducer }
