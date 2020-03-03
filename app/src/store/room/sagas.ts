import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { RoomActionTypes, JoinRoomPayload } from './types';
import { sendAction, createRoom, joinRoom } from '../websocket';
import { setUser } from './actions';

function* handleCreateRoom(action: any) {
  yield put(createRoom(action.payload));
}

function* handleJoinRoom(action: any) {
  const { username, roomId }: JoinRoomPayload = action.payload;
  yield put(setUser(username));
  yield put(joinRoom({ username, roomId }));
}

function* handleAddToPlaylist(action: any) {
  const item: MusicKit.MediaItem = action.payload;
  yield put(sendAction({ action: 'addToPlaylist', data: item }));
}

function* watchCreateRoom() {
  yield takeEvery(RoomActionTypes.CREATE_ROOM, handleCreateRoom);
}

function* watchJoinRoom() {
  yield takeEvery(RoomActionTypes.JOIN_ROOM, handleJoinRoom);
}

function* watchAddToPlaylist() {
  yield takeEvery(RoomActionTypes.ADD_TO_PLAYLIST, handleAddToPlaylist);
}

function* roomSaga() {
  yield all([fork(watchCreateRoom), fork(watchJoinRoom), fork(watchAddToPlaylist)]);
}

export { roomSaga }
