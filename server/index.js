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

    socket.join(user.room);

    callback({ roomId: room.id });
  });

  socket.on('join', ({ name, roomId }, callback) => {
    const { room, error: roomError } = getRoom(roomId);
    if (roomError) return callback({ error: roomError });

    const { user, error: userError } = addUser({ id: socket.id, name, room: room.id });
    if (userError) return callback({ error: userError });

    socket.emit('message', { user: 'system', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'system', text: `${user.name} has joined!` });

    socket.join(user.room);

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback({ roomId: room.id });
  });

  socket.on('sendAction', (action, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('action', { user: user.name, action: action });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'system', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  });
});

server.listen(process.env.PORT || 8002, () => console.log(`Server has started.`));
