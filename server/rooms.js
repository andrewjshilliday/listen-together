const rooms = [];

const createRoom = () => {
  const roomId = generateRoomId();
  const room = { id: roomId};
  rooms.push(room);

  return { room };
}

const removeRoom = (id) => {
  const index = rooms.findIndex((room) => room.id === id);

  if (index !== -1) {
    return rooms.splice(index, 1)[0];
  }
}

const getRoom = (id) => {
  return { room: rooms.find((room) => room.id === id) };
}

const generateRoomId = () => {
  let roomId = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 5; i++) {
    roomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return roomId;
}

module.exports = { createRoom, removeRoom, getRoom };
