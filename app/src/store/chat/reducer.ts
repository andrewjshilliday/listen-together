import { Reducer } from 'redux';
import { ChatState, ChatActionTypes } from './types';

export const initialState: ChatState = {
  popoverChatBoxVisible: false,
  popoverChatIconVisible: true,
  messages: [],
  unreadMessageCount: 0
}

const reducer: Reducer<ChatState> = (state = initialState, action) => {
  switch (action.type) {
    case ChatActionTypes.RECIEVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        unreadMessageCount: !state.popoverChatIconVisible ? 0 :
          (state.popoverChatBoxVisible ? state.unreadMessageCount : state.unreadMessageCount + 1)
      };
    case ChatActionTypes.SET_POPOVERBOXVISIBILITY:
      return {
        ...state,
        popoverChatBoxVisible: action.payload,
        unreadMessageCount: action.payload ? 0 : state.unreadMessageCount
      };
    case ChatActionTypes.SET_POPOVERICONVISIBILITY:
      return { ...state, popoverChatIconVisible: action.payload };
    default:
      return state;
  }
}

export { reducer as chatReducer }
