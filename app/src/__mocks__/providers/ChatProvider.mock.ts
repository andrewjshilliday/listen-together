const ChatProvider = {
  useChat: () => ({
    messages: ['test message 1', 'test message 2'].map((message, index) => ({ message, user: `user${index}`})),
    actions: {
      sendMessage: jest.fn(),
      setPopoverChatIconVisibility: jest.fn()
    }
  })
}

export default ChatProvider;
