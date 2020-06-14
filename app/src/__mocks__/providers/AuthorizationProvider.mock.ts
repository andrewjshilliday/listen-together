const AuthorizationProvider = {
  useAuthorization: () => ({
    authorized: true,
    actions: {
      signOut: jest.fn(),
      signIn: jest.fn()
    }
  })
}

export default AuthorizationProvider;
