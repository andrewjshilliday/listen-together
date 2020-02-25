export enum MusicKitActionTypes {
  SET_MUSICKITINSTANCE = '@@musicKit/SET_MUSICKITINSTANCE',
  SET_ISPLAYING = '@@musicKit/SET_ISPLAYING',
  SET_PLAYBACKLOADING = '@@musicKit/SET_PLAYBACKLOADING',
  SET_PLAYBACKTIME = '@@musicKit/SET_PLAYBACKTIME',
  SET_PLAYBACKTIMEREMAINING = '@@musicKit/SET_PLAYBACKTIMEREMAINING'
}

export interface MusicKitState {
  readonly musicKitInstance?: MusicKit.MusicKitInstance
  readonly isPlaying: boolean
  readonly playbackLoading: boolean
  readonly nowPlayingItem?: MusicKit.MediaItem
  readonly currentPlaybackTime: number
  readonly currentPlaybackTimeRemaining: number
}
