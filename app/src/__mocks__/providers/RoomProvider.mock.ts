const RoomProvider = {
  useRoom: () => ({
    username: 'testuser',
    roomId: 'TEST1',
    playlist: [],
    users: ['user0', 'user1'].map((user, index) => ({ name: user, id: `${index}`, color: '#cfcfcf' })),
    actions: {
      addToPlaylist: jest.fn()
    }
  })
}

export const notLoggedIn = {
  useRoom: () => ({})
}

export default RoomProvider
