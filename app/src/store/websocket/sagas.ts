import { eventChannel } from 'redux-saga';
import { all, call, fork, takeEvery, take, put } from 'redux-saga/effects';
import io from 'socket.io-client';
import { WebsocketActionTypes, WebsocketMusicKitActionPayload } from './types';
import { musicKitPlay, musicKitPause, musicKitNextTrack, musicKitPreviousTrack, musicKitSeekToTime } from '../musicKit';

function connect() {
  const socket = io(process.env.NODE_ENV === 'production' ? 'https://listen-together-server.herokuapp.com/' : 'localhost:8002');
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
      console.log("Socket connected");
    });
  });
}

function* read(socket: SocketIOClient.Socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    let action = yield take(channel);
    console.log('action', action);
    yield put(action);
  }
}

export function* subscribe(socket: SocketIOClient.Socket) {
  return eventChannel(emit => {
    const onAction = ({ musicKitActionType, seekToTime }: WebsocketMusicKitActionPayload) => {
      console.log('onaction', musicKitActionType, seekToTime);
      switch (musicKitActionType) {
        case 'play':
          return emit(musicKitPlay());
        case 'pause':
          return emit(musicKitPause());
        case 'nextTrack':
          return emit(musicKitNextTrack());
        case 'previousTrack':
          return emit(musicKitPreviousTrack());
        case 'seekToTime':
          return emit(musicKitSeekToTime(seekToTime!));
      }
    };
    console.log('socket listening on action');
    socket.on('action', onAction);
    return () => {}
  })
}

function handleSendMessage(socket: SocketIOClient.Socket, action: any) {
  const { message } = action.payload;
  socket.emit('sendMessage', { message: message }, ({ error }: any) => {
    if (error) {
      console.log(error);
    }
  });
}

function handleSendMusicKitAction(socket: SocketIOClient.Socket, action: any) {
  const { musicKitActionType, seekToTime }: WebsocketMusicKitActionPayload = action.payload;
  socket.emit('sendAction', { action: musicKitActionType, data: seekToTime }, ({ error }: any) => {
    if (error) {
      console.log(error);
    }
  });
}

function* watchSendMessage(socket: SocketIOClient.Socket) {
  yield takeEvery(WebsocketActionTypes.SEND_MESSAGE, handleSendMessage, socket);
}

function* watchSendMusicKitAction(socket: SocketIOClient.Socket) {
  yield takeEvery(WebsocketActionTypes.SEND_MUSICKIT_ACTION, handleSendMusicKitAction, socket);
}

function* websocketSaga() {
  yield take(WebsocketActionTypes.CONNECT);
  const socket = yield call(connect);
  yield all([fork(watchSendMessage, socket), fork(watchSendMusicKitAction, socket), fork(read, socket)]);
}

export { websocketSaga }
