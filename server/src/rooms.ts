export interface Room {
  id: string,
  queue: any[],
  currentQueuePosition: number
}

const rooms: Room[] = [];

export const createRoom = (): Room => {
  const roomId = generateRoomId();
  const room: Room = { id: roomId, queue: [], currentQueuePosition: 0 };
  rooms.push(room);

  return room;
}

export const removeRoom = (id: string): Room => {
  const index = rooms.findIndex((room) => room.id === id);

  if (index === -1) throw `Room with id ${id} not found`;

  return rooms.splice(index, 1)[0];
}

export const getRoom = (id: string): Room => {
  const room = rooms.find((room) => room.id === id.toUpperCase());

  if (!room) throw `Room with id ${id} not found`;

  return room;
}

const generateRoomId = (): string => {
  let roomId = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 5; i++) {
    roomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return roomId;
}
