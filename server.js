const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userLeave} = require('./utils/users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Counter';
const userList=[];
// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    console.log("Join room")
    const user = {id:socket.id,room:room,username:username, score:0}
    userList.push(user);
    socket.join(user.room);
    console.log(userList)
  });

  
  socket.on('increment', msg => {
    console.log('increment')
    const user = userList.find(usr => usr.id === socket.id)
    user.score += 1;
    console.log(user)
    io.to(user.room).emit('message', {userList});
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
