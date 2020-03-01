import { action } from 'typesafe-actions';
import { ChatActionTypes, Message } from './types';

export const sendMessage = (message: string) => action(ChatActionTypes.SEND_MESSAGE, message);
export const recieveMessage = (message: Message) => action(ChatActionTypes.RECIEVE_MESSAGE, message);
export const setPopoverBoxVisibility = (visibile: boolean) => action(ChatActionTypes.SET_POPOVERBOXVISIBILITY, visibile);
export const setPopoverIconVisibility = (visible: boolean) => action(ChatActionTypes.SET_POPOVERICONVISIBILITY, visible);
