import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { AuthenticationActionTypes } from './types';
import { setAuthenticated } from './actions';
declare const MusicKit: any;

function* handleSignIn() {
  const musicKit: MusicKit.MusicKitInstance = MusicKit.getInstance();
  yield call(musicKit.authorize.bind(musicKit));
  yield put(setAuthenticated());
}

function* handleSignOut() {
  const musicKit: MusicKit.MusicKitInstance = MusicKit.getInstance();
  yield call(musicKit.unauthorize.bind(musicKit));
  yield put(setAuthenticated());
  window.location.reload();
}

function* watchSignIn() {
  yield takeEvery(AuthenticationActionTypes.SIGN_IN, handleSignIn);
}

function* watchSignOut() {
  yield takeEvery(AuthenticationActionTypes.SIGN_OUT, handleSignOut);
}

function* authenticationSaga() {
  yield all([fork(watchSignIn), fork(watchSignOut)]);
}

export { authenticationSaga }
