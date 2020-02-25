import { action } from 'typesafe-actions';
import { MusicKitActionTypes } from './types';

export const setMusicKitInstance = () => action(MusicKitActionTypes.SET_MUSICKITINSTANCE);
export const setIsPlaying = (isPlaying: boolean) => action(MusicKitActionTypes.SET_ISPLAYING, isPlaying);
export const setPlaybackLoading = (playbackLoading: boolean) => action(MusicKitActionTypes.SET_PLAYBACKLOADING, playbackLoading);
export const setPlaybackTime = (playbackTime: number) => action(MusicKitActionTypes.SET_PLAYBACKTIME, playbackTime);
export const setPlaybackTimeRemaining = (playbackTimeRemaining: number) => action(MusicKitActionTypes.SET_PLAYBACKTIMEREMAINING, playbackTimeRemaining);
