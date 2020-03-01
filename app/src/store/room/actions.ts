import { action } from 'typesafe-actions';
import { RoomActionTypes, User } from './types';

export const setUser = (name: string) => action(RoomActionTypes.SET_USER, name);
export const setRoomId = (id: string) => action(RoomActionTypes.SET_ROOMID, id);
export const setPlaylist = (playlist: MusicKit.MediaItem[]) => action(RoomActionTypes.SET_PLAYLIST, playlist);
export const setUsersInRoom = (users: User[]) => action(RoomActionTypes.SET_USERSINROOM, users);
export const setPlaybackCountdown = (playbackCountdown: number) => action(RoomActionTypes.SET_PLAYBACKCOUNTDOWN, playbackCountdown);
export const createRoom = (name: string) => action(RoomActionTypes.CREATE_ROOM, name);
export const joinRoom = (id: string) => action(RoomActionTypes.JOIN_ROOM, id);
export const addToPlaylist = (item: MusicKit.MediaItem) => action(RoomActionTypes.ADD_TO_PLAYLIST, item);
