const MusicKitProvider = {
  useMusicKit: () => ({
    currentPlaybackTime: 0,
    currentPlaybackTimeRemaining: 60,
    isPlaying: true,
    playbackLoading: false,
    musicKit: {
      player: {
        repeatMode: 0,
        shuffleMode: 0,
        volume: 1,
        currentPlaybackDuration: 100,
        queue: {
          position: 0
        }
      }
    },
    nowPlayingItem: {
      assets: [{
        metadata: '1234567890'
      }],
      attributes: {
        artwork: {
          url: "https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/49/b1/57/49b15771-38c4-e54f-0971-3719826b9417/093624902263.jpg/{w}x{h}bb.jpeg",
        },
        albumName: "This Land",
        artistName: "Gary Clark Jr.",
        name: "This Land",
      },
    },
    actions: {
      setVolume: jest.fn(),
      play: jest.fn(),
      pause: jest.fn()
    }
  })
}

export default MusicKitProvider;
