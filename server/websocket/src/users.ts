import { Room } from "./rooms";

export interface User {
  id: string
  name: string
  color?: string
  room: Room
}

const users: User[] = [];

export const addUser = ({ id, name, room }: User): User => {
  name = name.trim().toLowerCase();

  const existingUser = users.find((user) => user.room.id === room.id && user.name === name);

  if (!name || !room) throw 'Username and room are required';
  if (existingUser) throw 'Username is taken';

  const user = { id, name, room } as User;
  user.color = generateUserColor();
  users.push(user);

  return user;
}

export const removeUser = (id: string): User => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) throw `User with id ${id} not found`;

  return users.splice(index, 1)[0];
}

export const getUserById = (id: string): User => {
  const user = users.find((user) => user.id === id);

  if (user == null) throw `User with id ${id} not found`;

  return user;
}

export const getUsersInRoom = (roomId: string): User[] => {
  return users.filter((user) => user.room.id === roomId);
}

const generateUserColor = (): string => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}
