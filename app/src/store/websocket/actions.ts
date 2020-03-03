import { action } from 'typesafe-actions';
import { WebsocketActionTypes, WebsocketChatMessagePayload, WebsocketSendActionPayload, WebsocketJoinRoomPayload } from './types';

export const connect = () => action(WebsocketActionTypes.CONNECT);
export const sendChatMessage = (payload: WebsocketChatMessagePayload) => action(WebsocketActionTypes.SEND_CHAT_MESSAGE, payload);
export const sendAction = (payload: WebsocketSendActionPayload) => action(WebsocketActionTypes.SEND_ACTION, payload);
export const createRoom = (username: string) => action(WebsocketActionTypes.CREATE_ROOM, username);
export const joinRoom = (payload: WebsocketJoinRoomPayload) => action(WebsocketActionTypes.JOIN_ROOM, payload);
