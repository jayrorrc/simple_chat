const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.emit('connections', io.sockets.sockets.size);
  socket.broadcast.emit('connections', io.sockets.sockets.size);

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

  socket.on('viewedMensage', (data) => {
    socket.broadcast.emit('viewedMensage', (data));
  });
});

const PORT = 3000

server.listen(PORT, () => {
    console.log(`Listening on port *: ${PORT}`);
});

