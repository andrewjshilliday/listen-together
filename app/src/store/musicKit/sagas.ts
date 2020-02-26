import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { MusicKitActionTypes } from './types';
declare const MusicKit: any;

function* handlePlay() {
  const musicKit: MusicKit.MusicKitInstance = MusicKit.getInstance();
  yield call(musicKit.player.play.bind(musicKit));
  /* yield put(setAuthenticated()); */
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

function* musicKitSaga() {
  yield all([fork(watchPlay), fork(watchPause), fork(watchNextTrack), fork(watchPreviousTrack), fork(watchSeekToTime)]);
}

export { musicKitSaga }
