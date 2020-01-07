import React, { createContext, useContext, useState } from 'react'
declare const MusicKit: any;

interface AuthorizationProviderState {
  authorized: boolean,
  signIn: () => void,
  signOut: () => void
}

const AuthorizationContext = createContext({} as AuthorizationProviderState);

export const AuthorizationProvider = (props: any) => {

  const signIn = async () => {
    const musicKit = MusicKit.getInstance();
    await musicKit.authorize();
    setAuthorized(true);
  };
  
  const signOut = async () => {
    const musicKit = MusicKit.getInstance();
    await musicKit.unauthorize();
    setAuthorized(false);
  };

  const setAuthorized = (authorized: boolean) => {
    setState({...state, authorized: authorized});
  };

  const value: AuthorizationProviderState = {
    authorized: MusicKit.getInstance().isAuthorized,
    signIn: signIn,
    signOut: signOut
  };

  const [state, setState] = useState(value);

  return (
    <AuthorizationContext.Provider value={state}>
      {props.children}
    </AuthorizationContext.Provider>
  );

}

export const useAuthorization = () => {
  return useContext(AuthorizationContext);
}
