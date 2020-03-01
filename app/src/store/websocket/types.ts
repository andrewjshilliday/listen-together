export enum WebsocketActionTypes {
  CONNECT = '@@websocket/CONNECT',
  SEND_ACTION = '@@websocket/SEND_ACTION',
  SEND_CHAT_MESSAGE = '@@websocket/SEND_MESSAGE',
  CREATE_ROOM = '@@websocket/CREATE_ROOM',
  JOIN_ROOM = '@@websocket/JOIN_ROOM'
}

export interface WebsocketState {
  socket?: SocketIOClient.Socket
}

export interface WebsocketChatMessagePayload {
  message: string
}

export interface WebsocketSendActionPayload {
  sendActionType: WebsocketSendActionType
  data?: any
}

export interface WebsocketJoinRoomPayload {
  username: string
  roomId: string
}

export type WebsocketSendActionType = 'play' | 'pause' | 'nextTrack' | 'previousTrack' | 'seekToTime' | 'addToPlaylist';
