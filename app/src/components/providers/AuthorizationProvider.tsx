import React, { createContext, useContext, useState } from 'react'
declare const MusicKit: any;

interface AuthorizationProviderState {
  authorized: boolean
  actions: IActions
}

interface IActions {
  signIn: Function
  signOut: Function
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

  const [state, setState] = useState({
    authorized: MusicKit.getInstance().isAuthorized,
    actions: {
      signIn: signIn,
      signOut: signOut
    }
  });

  return (
    <AuthorizationContext.Provider value={state}>
      {props.children}
    </AuthorizationContext.Provider>
  );

}

export const useAuthorization = () => {
  return useContext(AuthorizationContext);
}
