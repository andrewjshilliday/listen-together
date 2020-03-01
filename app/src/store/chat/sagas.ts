import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { ChatActionTypes } from './types';
import { sendChatMessage } from '../websocket';

function* handleSendMessage(action: any) {
  yield put(sendChatMessage(action.payload));
}

function* watchSendMessage() {
  yield takeEvery(ChatActionTypes.SEND_MESSAGE, handleSendMessage);
}

function* chatSaga() {
  yield all([fork(watchSendMessage)]);
}

export { chatSaga }
