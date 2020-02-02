const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const { createRoom, removeRoom, getRoom } = require('./rooms');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  socket.on('create', ({ name }, callback) => {
    const { room, error: roomError } = createRoom();
    if (roomError) return callback({ error: roomError });

    const { user, error: userError } = addUser({ id: socket.id, name, room: room.id });
    if (userError) return callback({ error: userError });

    console.log('room created', room.id);

    socket.join(user.room);

    callback({ roomId: room.id });
  });

  socket.on('join', ({ name, roomId }, callback) => {
    const room = getRoom(roomId);
    if (!room) return callback({ error: 'room not found' });

    const { user, error: userError } = addUser({ id: socket.id, name, room: room.id });
    if (userError) return callback({ error: userError });

    // socket.emit('message', { user: name, queue: room.queue, currentPosition: room.currentPosition});
    socket.broadcast.to(user.room).emit('message', { user: 'system', text: `${user.name} has joined!` });

    socket.join(user.room);

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback({ roomId: room.id, playlist: room.queue, currentPosition: room.currentPosition });
  });

  socket.on('sendAction', ({ action, data }, callback) => {
    const user = getUser(socket.id);

    if (action === 'addToPlaylist' && data && data.id) {
      const room = getRoom(user.room);
      room.queue.push(data);
    }

    io.to(user.room).emit('action', { user: user.name, action: action, data: data, currentPosition: user.room.currentPosition });

    /* callback(); */
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      const usersInRoom = getUsersInRoom(user.room);

      io.to(user.room).emit('message', { user: 'system', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: usersInRoom});

      if (!usersInRoom || usersInRoom.length === 0) {
        const room = removeRoom(user.room.id);
        console.log('room removed', user.room.id);
      }
    }
  });

  socket.on('playbackInfo', ({ action, username, data }, callback) => {
    const user = getUser(socket.id);

    if (action === 'request') {
      io.to(user.room).emit('playbackInfo', { action: 'request', username: username });
    }
    if (action === 'send') {
      io.to(user.room).emit('playbackInfo', { action: 'send', username: username, data: { queuePosition: data.queuePosition, playbackTime: data.playbackTime } });
    }

    if (callback) {
      callback();
    }
  })
});

server.listen(process.env.PORT || 8002, () => console.log(`Server has started.`));
