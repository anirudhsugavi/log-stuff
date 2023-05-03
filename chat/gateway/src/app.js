const app = require('express')();
const server = require('http').createServer(app);
const socketIo = require('socket.io');

const PORT = process.env.GATEWAY_PORT || 5000;

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
  },
});

server.listen(PORT, () => {
  console.log(`Gateway listening on ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});
