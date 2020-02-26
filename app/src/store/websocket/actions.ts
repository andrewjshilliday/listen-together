import { action } from 'typesafe-actions';
import { WebsocketActionTypes, WebsocketMessagePayload, WebsocketMusicKitActionPayload } from './types';

export const connect = () => action(WebsocketActionTypes.CONNECT);
export const sendMessage = (payload: WebsocketMessagePayload) => action(WebsocketActionTypes.SEND_MESSAGE, payload);
export const sendMusicKitAction = (payload: WebsocketMusicKitActionPayload) => action(WebsocketActionTypes.SEND_MUSICKIT_ACTION, payload);
