import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import cors from 'cors';

import router from './router';
import { addUser, removeUser, getUserById, getUsersInRoom, User } from './users';
import { createRoom, removeRoom, getRoom, Room } from './rooms';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {

  socket.on('create', ({ name }, callback) => {
    let room: Room;
    try {
      room = createRoom();
    } catch (error) {
      return callback({ error: error });
    }

    let user: User;
    try {
      user = addUser({ id: socket.id, name, room: room });
    } catch (error) {
      return callback({ error: error });
    }

    console.log('room created', room.id);

    socket.join(user.room.id);

    callback({ roomId: room.id });
  });

  socket.on('join', ({ name, roomId }, callback) => {
    if (!name) return callback({ error: 'no username supplied' });
    if (!roomId) return callback({ error: 'no roomId supplied' });

    let room: Room;
    try {
      room = getRoom(roomId);
    } catch (error) {
      return callback({ error: error });
    }

    let user: User;
    try {
      user = addUser({ id: socket.id, name, room: room });
    } catch (error) {
      return callback({ error: error });
    }

    socket.broadcast.to(user.room.id).emit('message', { user: 'system', text: `${user.name} has joined!` });

    socket.join(user.room.id);

    io.to(user.room.id).emit('roomData', { room: user.room.id, users: getUsersInRoom(user.room.id) });

    callback({ roomId: room.id, playlist: room.queue, currentQueuePosition: room.currentQueuePosition });
  });

  socket.on('sendAction', ({ action, data }, callback) => {
    const user = getUserById(socket.id);

    if (action === 'addToPlaylist' && data && data.id) {
      const room = getRoom(user.room.id);
      room.queue.push(data);
    }

    io.to(user.room.id).emit('action', { user: user.name, action: action, data: data, currentQueuePosition: user.room.currentQueuePosition });

    if (callback) {
      callback({});
    }
  });

  socket.on('sendMessage', ({ message }, callback) => {
    const user = getUserById(socket.id);

    io.to(user.room.id).emit('message', { user: user.name, text: message });

    if (callback) {
      callback({});
    }
  });

  socket.on('playbackInfo', ({ action, username, data }, callback) => {
    const user = getUserById(socket.id);

    switch (action) {
      case 'request':
        io.to(user.room.id).emit('playbackInfo', {
          action: 'request',
          username: username
        });
        break;
      case 'send':
        io.to(user.room.id).emit('playbackInfo', {
          action: 'send',
          username: username,
          data:
          {
            queuePosition: data.queuePosition,
            playbackTime: data.playbackTime
          }
        });
        break;
    }

    if (callback) {
      callback({});
    }
  });

  socket.on('disconnect', () => {
    let user: User;
    try {
      user = removeUser(socket.id);
    } catch (error) {
      return;
    }

    if (user) {
      const usersInRoom = getUsersInRoom(user.room.id);

      io.to(user.room.id).emit('message', { user: 'system', text: `${user.name} has left.` });
      io.to(user.room.id).emit('roomData', { room: user.room.id, users: usersInRoom});

      if (!usersInRoom || usersInRoom.length === 0) {
        console.log('room removed', user.room.id);
        removeRoom(user.room.id);
      }
    }
  });

});

server.listen(process.env.PORT || 8002, () => console.log(`Server has started.`));
