import { Reducer } from 'redux';
import { MusicKitState, MusicKitActionTypes } from './types';
declare const MusicKit: any;

export const initialState: MusicKitState = {
  isPlaying: false,
  playbackLoading: false,
  currentPlaybackTime: 0,
  currentPlaybackTimeRemaining: 0
}

const reducer: Reducer<MusicKitState> = (state = initialState, action) => {
  switch (action.type) {
    case MusicKitActionTypes.SET_MUSICKITINSTANCE:
      return { ...state, musicKitInstance: MusicKit.getInstance() };
    case MusicKitActionTypes.SET_ISPLAYING:
      return { ...state, isPlaying: action.payload };
    case MusicKitActionTypes.SET_PLAYBACKLOADING:
      return { ...state, playbackLoading: action.payload };
    case MusicKitActionTypes.SET_PLAYBACKTIME:
      return { ...state, currentPlaybackTime: action.payload };
    case MusicKitActionTypes.SET_PLAYBACKTIMEREMAINING:
      return { ...state, currentPlaybackTimeRemaining: action.payload };
    default:
      return state;
  }
}

export { reducer as musicKitReducer }
