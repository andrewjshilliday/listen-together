import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { MusicKitActionTypes } from './types';
import { musicKitPlay } from './actions';
declare const MusicKit: any;

function* handlePlay() {
  const musicKit: MusicKit.MusicKitInstance = MusicKit.getInstance();
  yield call(musicKit.player.play.bind(musicKit));
}

function* handlePause() {
  const musicKit: MusicKit.MusicKitInstance = MusicKit.getInstance();
  yield call(musicKit.player.pause.bind(musicKit));
}

function* handleNextTrack() {
  const musicKit: MusicKit.MusicKitInstance = MusicKit.getInstance();
  yield call(musicKit.player.skipToNextItem.bind(musicKit));
}

function* handlePreviousTrack() {
  const musicKit: MusicKit.MusicKitInstance = MusicKit.getInstance();
  yield call(musicKit.player.skipToPreviousItem.bind(musicKit));
}

function* handleSeekToTime(action: any) {
  const { seekToTime } = action.payload;
  const musicKit: MusicKit.MusicKitInstance = MusicKit.getInstance();
  yield call(musicKit.player.seekToTime.bind(musicKit), seekToTime);
}

function* handleAddToQueue(action: any) {
  const item: MusicKit.MediaItem = action.payload;
  const musicKit: MusicKit.MusicKitInstance = MusicKit.getInstance();
  if (musicKit.player.queue.items.length === 0) {
    yield call(musicKit.setQueue.bind(musicKit), { [item.attributes.playParams.kind]: item.attributes.playParams.id });
    yield put(musicKitPlay());
  } else {
    yield call(musicKit.player.queue.append.bind(musicKit), item);
  }
}

function* handleSetQueuePosition(action: any) {
  const musicKit: MusicKit.MusicKitInstance = MusicKit.getInstance();
  yield call(musicKit.changeToMediaAtIndex.bind(musicKit), action.payload);
}

function* watchPlay() {
  yield takeEvery(MusicKitActionTypes.MUSICKIT_PLAY, handlePlay);
}

function* watchPause() {
  yield takeEvery(MusicKitActionTypes.MUSICKIT_PAUSE, handlePause);
}

function* watchNextTrack() {
  yield takeEvery(MusicKitActionTypes.MUSICKIT_NEXTTRACK, handleNextTrack);
}

function* watchPreviousTrack() {
  yield takeEvery(MusicKitActionTypes.MUSICKIT_NEXTTRACK, handlePreviousTrack);
}

function* watchSeekToTime() {
  yield takeEvery(MusicKitActionTypes.MUSICKIT_NEXTTRACK, handleSeekToTime);
}

function* watchAddToQueue() {
  yield takeEvery(MusicKitActionTypes.MUSICKIT_ADDTOQUEUE, handleAddToQueue);
}

function* watchSetQueuePosition() {
  yield takeEvery(MusicKitActionTypes.MUSICKIT_SETQUEUEPOSITION, handleSetQueuePosition);
}

function* musicKitSaga() {
  yield all([
    fork(watchPlay),
    fork(watchPause),
    fork(watchNextTrack),
    fork(watchPreviousTrack),
    fork(watchSeekToTime),
    fork(watchAddToQueue),
    fork(watchSetQueuePosition)
  ]);
}

export { musicKitSaga }
