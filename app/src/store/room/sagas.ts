import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { RoomActionTypes } from './types';
import { sendAction, createRoom } from '../websocket';

function* handleCreateRoom(action: any) {
  yield put(createRoom(action.payload));
}

function* handleAddToPlaylist(action: any) {
  const item: MusicKit.MediaItem = action.payload;
  yield put(sendAction({ sendActionType: 'addToPlaylist', data: item }));
}

function* watchCreateRoom() {
  yield takeEvery(RoomActionTypes.CREATE_ROOM, handleCreateRoom);
}

function* watchAddToPlaylist() {
  yield takeEvery(RoomActionTypes.ADD_TO_PLAYLIST, handleAddToPlaylist);
}

function* roomSaga() {
  yield all([fork(watchCreateRoom), fork(watchAddToPlaylist)]);
}

export { roomSaga }
