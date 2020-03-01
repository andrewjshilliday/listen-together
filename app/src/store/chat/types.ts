export enum ChatActionTypes {
  SEND_MESSAGE = '@@chat/SEND_MESSAGE',
  RECIEVE_MESSAGE = '@@chat/RECIEVE_MESSAGE',
  SET_POPOVERBOXVISIBILITY = '@@chat/SET_POPOVERBOXVISIBILITY',
  SET_POPOVERICONVISIBILITY = '@@chat/SET_POPOVERICONVISIBILITY'
}

export interface ChatState {
  popoverChatBoxVisible: boolean
  popoverChatIconVisible: boolean
  messages: Message[]
  unreadMessageCount: number
}

export interface Message {
  text: string
  user: string
}
