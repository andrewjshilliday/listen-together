import { eventChannel } from 'redux-saga';
import { all, call, fork, takeEvery, take, put, cancelled, select } from 'redux-saga/effects';
import io from 'socket.io-client';
import { WebsocketActionTypes, WebsocketSendActionPayload, WebsocketJoinRoomPayload } from './types';
import { ApplicationState } from '..';
import { musicKitPlay, musicKitPause, musicKitNextTrack, musicKitPreviousTrack, musicKitSeekToTime, musicKitAddToQueue, musicKitSetQueuePosition } from '../musicKit';
import { recieveMessage } from '../chat';
import { setRoomId, setPlaylist, setUsersInRoom, User, setPlaybackCountdown } from '../room';

function connect() {
  const socket = io(process.env.NODE_ENV === 'production' ? 'https://listen-together-server.herokuapp.com/' : 'localhost:8002');
  return new Promise(resolve => {
    socket.on('connect', () => {
      resolve(socket);
      console.log("Socket connected");
    });
  });
}

function* recieve(socket: SocketIOClient.Socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    let action = yield take(channel);
    console.log('action', action);
    yield put(action);
  }
}

export function* subscribe(socket: SocketIOClient.Socket) {
  const currentUsername = yield select((state: ApplicationState) => state.room.username);
  const currentPlaybackCountdown = yield select((state: ApplicationState) => state.room.playbackCountdown);
  return eventChannel(emit => {
    const onAction = ({ sendActionType, data }: WebsocketSendActionPayload) => {
      console.log('onaction', sendActionType, data);
      switch (sendActionType) {
        case 'play':
          return emit(musicKitPlay());
        case 'pause':
          return emit(musicKitPause());
        case 'nextTrack':
          return emit(musicKitNextTrack());
        case 'previousTrack':
          return emit(musicKitPreviousTrack());
        case 'seekToTime':
          return emit(musicKitSeekToTime(data!));
        case 'addToPlaylist':
          return emit(musicKitAddToQueue(data!));
      }
    };
    const onMessage = (message: any) => {
      emit(recieveMessage(message));
    };
    const onRoomData = ({ room, users }: any) => {
      console.log(users.filter((user: User) => user.name !== currentUsername));
      emit(setUsersInRoom(users.filter((user: User) => user.name !== currentUsername)));
    };
    const onPlaybackInfo = async ({ action, username, data }: any) => {
      if (action === 'request' && username !== currentUsername) {
        const musicKit: MusicKit.MusicKitInstance = MusicKit.getInstance();
        socket.emit('playbackInfo', {
          action: 'send',
          username: username,
          data: {
            queuePosition: musicKit.player.queue.position,
            playbackTime: musicKit.player.currentPlaybackTimeRemaining
          }
        });
      }
      if (action === 'send' && username === currentUsername ) {

        if (data.queuePosition) {
          emit(musicKitSetQueuePosition(data.queuePosition));
        }
        if (data.playbackTime) {
          emit(setPlaybackCountdown(data.playbackTime));
          setTimeout(() => {
            emit(musicKitPlay());
          }, data.playbackTime * 1000);
          const countdown = setInterval(() => {
            emit(setPlaybackCountdown(currentPlaybackCountdown - 1));
            if (currentPlaybackCountdown <= 0) {
              clearInterval(countdown);
            }
          }, 1000);
        }
      };
    };

    console.log('socket listening');
    socket.on('action', onAction);
    socket.on('message', onMessage);
    socket.on('roomData', onRoomData);
    socket.on('playbackInfo', onPlaybackInfo);
    return () => {}
  })
}

function handleSendChatMessage(socket: SocketIOClient.Socket, action: any) {
  const { message } = action.payload;
  socket.emit('sendMessage', { message: message }, ({ error }: any) => {
    if (error) {
      console.log(error);
    }
  });
}

function handleSendAction(socket: SocketIOClient.Socket, action: any) {
  const { sendActionType, data }: WebsocketSendActionPayload = action.payload;
  socket.emit('sendAction', { action: sendActionType, data: data }, ({ error }: any) => {
    if (error) {
      console.log(error);
    }
  });
}

function* handleCreateRoom(socket: SocketIOClient.Socket, action: any) {
  const createRoomChannel = eventChannel(emit => {
    socket.emit('create', { name: action.payload }, ({ roomId, error }: any) => {
      emit({ roomId, error });
    });
    return () => {};
  });
  try {
    while (true) {
      const { roomId, error } = yield take(createRoomChannel);
      if (error) {
        console.log(error);
        return;
      }
      yield put(setRoomId(roomId));
      /* callback(roomId); */
    }
  } finally {
    if (yield cancelled()) createRoomChannel.close();
  }
}

function* handleJoinRoom(socket: SocketIOClient.Socket, action: any) {
  const { username, roomId }: WebsocketJoinRoomPayload = action.payload;
  const joinRoomChannel = eventChannel(emit => {
    socket.emit('join', { name: username, roomId: roomId.trim() }, async ({ roomId, playlist, error }: any) => {
      emit({ roomId, playlist, error });
    });
    return () => {};
  });
  try {
    while (true) {
      const { roomId, playlist, error } = yield take(joinRoomChannel);
      if (error) {
        console.log(error);
        return;
      }
      yield put(setRoomId(roomId));
      yield put(setPlaylist(playlist));
      /* callback(roomId); */

      if (playlist && playlist.length) {
        // fix this. need to set multiple items at once, set queue position and playback time
        for (let i = 0; i < playlist.length; i++) {
          yield put(musicKitAddToQueue(playlist[i]));
        }
        
        socket.emit('playbackInfo', { action: 'request', username: username });
      }
    }
  } finally {
    if (yield cancelled()) joinRoomChannel.close();
  }
}

function* watchSendChatMessage(socket: SocketIOClient.Socket) {
  yield takeEvery(WebsocketActionTypes.SEND_CHAT_MESSAGE, handleSendChatMessage, socket);
}

function* watchSendAction(socket: SocketIOClient.Socket) {
  yield takeEvery(WebsocketActionTypes.SEND_ACTION, handleSendAction, socket);
}

function* watchCreateRoom(socket: SocketIOClient.Socket) {
  yield takeEvery(WebsocketActionTypes.CREATE_ROOM, handleCreateRoom, socket);
}

function* watchJoinRoom(socket: SocketIOClient.Socket) {
  yield takeEvery(WebsocketActionTypes.JOIN_ROOM, handleJoinRoom, socket);
}

function* websocketSaga() {
  yield take(WebsocketActionTypes.CONNECT);
  const socket = yield call(connect);
  yield all([
    fork(recieve, socket),
    fork(watchSendChatMessage, socket),
    fork(watchSendAction, socket),
    fork(watchCreateRoom, socket),
    fork(watchJoinRoom, socket)
  ]);
}

export { websocketSaga }
