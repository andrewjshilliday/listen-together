export enum WebsocketActionTypes {
  CONNECT = '@@websocket/CONNECT',
  SEND_MUSICKIT_ACTION = '@@websocket/SEND_MUSICKIT_ACTION',
  SEND_MESSAGE = '@@websocket/SEND_MESSAGE'
}

export interface WebsocketState {
  socket?: SocketIOClient.Socket
}

export interface WebsocketMessagePayload {
  message: string
}

export interface WebsocketMusicKitActionPayload {
  musicKitActionType: WebsocketMusicKitActionType
  seekToTime?: number
}

export type WebsocketMusicKitActionType = 'play' | 'pause' | 'nextTrack' | 'previousTrack' | 'seekToTime';
