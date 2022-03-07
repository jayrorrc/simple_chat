const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
  socket.emit('connections', Object.keys(io.sockets.connected).length);

  socket.on('disconnect', () => {
      console.log("A user disconnected");
  });

  socket.on('chatMessage', (data) => {
    socket.broadcast.emit('chatMessage', (data));
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', (data));
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('stopTyping');
  });

  socket.on('joined', (data) => {
    socket.broadcast.emit('joined', (data));
  });

  socket.on('leave', (data) => {
    socket.broadcast.emit('leave', (data));
  });
});

const PORT = 3000

server.listen(PORT, () => {
    console.log(`Listening on port *: ${PORT}`);
});

