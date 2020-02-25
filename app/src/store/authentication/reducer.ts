import { Reducer } from 'redux';
import { AuthenticationState, AuthenticationActionTypes } from './types';
declare const MusicKit: any;

export const initialState: AuthenticationState = {
  authenticated: false
}

const reducer: Reducer<AuthenticationState> = (state = initialState, action) => {
  switch (action.type) {
    case AuthenticationActionTypes.SET_AUTHENTICATED:
      return { ...state, authenticated: MusicKit.getInstance().isAuthorized };
    default:
      return state;
  }
}

export { reducer as authenticationReducer }
