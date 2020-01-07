import React, { ReactNode, createContext, useContext } from 'react'
import { Secrets } from '../../secrets';
declare const MusicKit: any;

interface MusicKitProviderState {
  musicKit: any,
  isPlaying: boolean,
  playbackLoading: boolean,
  nowPlayingItem?: any,
  currentPlaybackTime: number,
  currentPlaybackTimeRemaining: number,
  play: () => void,
  pause: () => void,
  setVolume: (v: number | number[]) => void
}

interface MusicKitProviderProps {
  children: ReactNode
}

const MusicKitContext = createContext({} as MusicKitProviderState);

export class MusicKitProvider extends React.Component<MusicKitProviderProps, MusicKitProviderState> {

  constructor(props: MusicKitProviderProps) {
    super(props);

    MusicKit.configure({
      developerToken: Secrets.appleMusicDevToken,
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
      play: this.play,
      pause: this.pause,
      setVolume: this.setVolume
    }
  }

  componentDidMount = () => {
    this.state.musicKit.addEventListener(MusicKit.Events.mediaItemDidChange, this.mediaItemDidChange);
    this.state.musicKit.addEventListener(MusicKit.Events.playbackStateDidChange, this.playbackStateDidChange);
    /* this.state.musicKit.addEventListener(MusicKit.Events.queueItemsDidChange, this.queueItemsDidChange); */
    this.state.musicKit.addEventListener(MusicKit.Events.playbackTimeDidChange, this.playbackTimeDidChange);

    const volume = localStorage.getItem('volume');
    if (!volume) {
      this.setVolume(1);
    } else {
      this.setVolume(+volume);
    }
  }

  componentWillUnmount = () => {
    this.state.musicKit.removeEventListener(MusicKit.Events.mediaItemDidChange, this.mediaItemDidChange);
    this.state.musicKit.removeEventListener(MusicKit.Events.playbackStateDidChange, this.playbackStateDidChange);
    /* this.state.musicKit.removeEventListener(MusicKit.Events.queueItemsDidChange, this.queueItemsDidChange); */
    this.state.musicKit.removeEventListener(MusicKit.Events.playbackTimeDidChange, this.playbackTimeDidChange);
  }

  /* shouldComponentUpdate() {
    return true;
  } */

  play = () => {
    console.log('play');
    this.state.musicKit.player.play();
  };

  pause = () => {
    console.log('pause');
    this.state.musicKit.player.pause();
  }

  setVolume = (volume: number | number[]) => {
    const audio: any = document.getElementById('apple-music-player');
    if (audio) {
      audio.volume = volume;
      localStorage.setItem('volume', volume.toString());
    }
  }

  mediaItemDidChange = (event: any) => {
    console.log(`mediaItemDidChange`);
    console.log(event.item);
    this.setState({
      nowPlayingItem: event.item
    });
  }

  playbackStateDidChange = (event: any) => {
    console.log(`playbackStateDidChange`);
    console.log(event.state);
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

  /* queueItemsDidChange = (event: any) => {
    console.log(`queueItemsDidChange`);
    console.log(event);
  } */

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
