import React, { ReactNode, createContext, useContext } from 'react'
import { Secrets } from '../../secrets';
import { WebSocketContext } from './WebSocketProvider';
declare const MusicKit: any;

interface MusicKitProviderState {
  musicKit: MusicKit.MusicKitInstance
  isPlaying: boolean
  playbackLoading: boolean
  nowPlayingItem?: MusicKit.MediaItem
  currentPlaybackTime: number
  currentPlaybackTimeRemaining: number
  actions: IActions
}

interface IActions {
  play: Function
  pause: Function
  next: Function
  previous: Function
  setVolume: Function
}

interface MusicKitProviderProps {
  children: ReactNode
}

const MusicKitContext = createContext({} as MusicKitProviderState);

export class MusicKitProvider extends React.Component<MusicKitProviderProps, MusicKitProviderState> {

  static contextType = WebSocketContext;

  constructor(props: MusicKitProviderProps) {
    super(props);

    MusicKit.configure({
      developerToken: process.env.REACT_APP_MUSICKIT_TOKEN,
      app: {
        name: 'ListenTogether',
        build: '0.1',
        version: '0.1',
      }
    });

    this.state = {
      musicKit: MusicKit.getInstance(),
      isPlaying: false,
      playbackLoading: false,
      currentPlaybackTime: 0,
      currentPlaybackTimeRemaining: 0,
      actions: {
        play: this.play,
        pause: this.pause,
        next: this.next,
        previous: this.previous,
        setVolume: this.setVolume
      }
    };
  }

  componentDidMount = () => {
    this.state.musicKit.addEventListener('mediaItemDidChange', this.mediaItemDidChange);
    this.state.musicKit.addEventListener('playbackStateDidChange', this.playbackStateDidChange);
    this.state.musicKit.addEventListener('playbackTimeDidChange', this.playbackTimeDidChange);

    const volume = localStorage.getItem('volume');
    if (!volume) {
      this.setVolume(1);
    } else {
      this.setVolume(+volume);
    }

    this.context.socket.on('action', ({ action, data }: any) => {
      switch (action) {
        case 'play':
          this.state.musicKit.player.play();
          break;
        case 'pause':
          this.state.musicKit.player.pause();
          break;
        case 'nextTrack':
          this.state.musicKit.player.skipToNextItem();
          break;
        case 'previousTrack':
          this.state.musicKit.player.skipToPreviousItem();
          break;
        case 'seekToTime':
          this.state.musicKit.player.seekToTime(data);
          break;
      }
    });
  }

  componentWillUnmount = () => {
    this.state.musicKit.removeEventListener('mediaItemDidChange', this.mediaItemDidChange);
    this.state.musicKit.removeEventListener('playbackStateDidChange', this.playbackStateDidChange);
    this.state.musicKit.removeEventListener('playbackTimeDidChange', this.playbackTimeDidChange);
  }

  /* shouldComponentUpdate() {
    return true;
  } */

  play = () => {
    console.log('play');
    this.context.actions.sendAction('play');
  };

  pause = () => {
    console.log('pause');
    this.context.actions.sendAction('pause');
  }

  next = () => {
    console.log('next');
    this.context.actions.sendAction('nextTrack');
  }

  previous = () => {
    console.log('previous');
    if (this.state.currentPlaybackTime < 10000) {
      this.context.actions.sendAction('previousTrack');
    } else {
      this.context.actions.sendAction('seekToTime', 0);
    }
  }

  setVolume = (volume: number | number[]) => {
    this.state.musicKit.player.volume = volume;
    localStorage.setItem('volume', volume.toString());
  }

  mediaItemDidChange = (event: any) => {
    console.log(`mediaItemDidChange`);
    this.setState({ nowPlayingItem: event.item });
  }

  playbackStateDidChange = (event: any) => {
    console.log(`playbackStateDidChange`);
    this.setState({
      isPlaying: event.state === 2,
      playbackLoading: event.state === 1 || event.state === 8
    });
  }

  playbackTimeDidChange = () => {
    this.setState({
      currentPlaybackTime: this.state.musicKit.player.currentPlaybackTime,
      currentPlaybackTimeRemaining: this.state.musicKit.player.currentPlaybackTimeRemaining
    });
  }

  render() {
    return (
      <MusicKitContext.Provider value={this.state}>
        {this.props.children}
      </MusicKitContext.Provider>
    );
  }
}

export const useMusicKit = () => {
  return useContext(MusicKitContext);
}
