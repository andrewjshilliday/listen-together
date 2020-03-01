export enum RoomActionTypes {
  SET_USER = '@@room/SET_USER',
  SET_ROOMID = '@@room/SET_ROOMID',
  SET_PLAYLIST = '@@room/SET_PLAYLIST',
  SET_USERSINROOM = '@@room/SET_USERSINROOM',
  SET_PLAYBACKCOUNTDOWN = '@@room/SET_PLAYBACKCOUNTDOWN',
  CREATE_ROOM = '@@room/CREATE_ROOM',
  JOIN_ROOM = '@@room/JOIN_ROOM',
  ADD_TO_PLAYLIST = '@@room/ADD_TO_PLAYLIST'
}

export interface RoomState {
  roomId?: string
  username?: string
  playlist: MusicKit.MediaItem[]
  users: User[]
  playbackCountdown?: number
}

export interface User {
  name: string
  id: string
  color: string
}
