export enum AuthenticationActionTypes {
  SET_AUTHENTICATED = '@@authentication/SET_AUTHENTICATED',
  SIGN_IN = '@@authentication/SIGN_IN',
  SIGN_OUT = '@@authentication/SIGN_OUT',
}

export interface AuthenticationState {
  readonly authenticated: boolean
}
