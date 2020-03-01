import { action } from 'typesafe-actions';
import { MusicKitActionTypes, PlaybackTimePayload } from './types';

export const setMusicKitInstance = () => action(MusicKitActionTypes.SET_MUSICKITINSTANCE);
export const setIsPlaying = (isPlaying: boolean) => action(MusicKitActionTypes.SET_ISPLAYING, isPlaying);
export const setPlaybackLoading = (playbackLoading: boolean) => action(MusicKitActionTypes.SET_PLAYBACKLOADING, playbackLoading);
export const setPlaybackTime = (playbackTimePayload: PlaybackTimePayload) => action(MusicKitActionTypes.SET_PLAYBACKTIME, playbackTimePayload);
export const setNowPlayingItem = (nowPlayingItem: MusicKit.MediaItem) => action(MusicKitActionTypes.SET_NOWPLAYINGITEM, nowPlayingItem);
export const musicKitPlay = () => action(MusicKitActionTypes.MUSICKIT_PLAY);
export const musicKitPause = () => action(MusicKitActionTypes.MUSICKIT_PAUSE);
export const musicKitNextTrack = () => action(MusicKitActionTypes.MUSICKIT_NEXTTRACK);
export const musicKitPreviousTrack = () => action(MusicKitActionTypes.MUSICKIT_PREVIOUSTRACK);
export const musicKitSeekToTime = (seekToTime: number) => action(MusicKitActionTypes.MUSICKIT_SEEKTOTIME, seekToTime);
export const musicKitAddToQueue = (item: MusicKit.MediaItem) => action(MusicKitActionTypes.MUSICKIT_ADDTOQUEUE, item);
export const musicKitSetQueuePosition = (position: number) => action(MusicKitActionTypes.MUSICKIT_SETQUEUEPOSITION, position);
