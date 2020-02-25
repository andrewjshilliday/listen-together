import { action } from 'typesafe-actions';
import { AuthenticationActionTypes } from './types';

export const setAuthenticated = () => action(AuthenticationActionTypes.SET_AUTHENTICATED)
export const signIn = () => action(AuthenticationActionTypes.SIGN_IN);
export const signOut = () => action(AuthenticationActionTypes.SIGN_OUT);
