require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes.js');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

const Redis = require('ioredis');
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../client/dist'));

app.use('/api', routes);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

io.on('connection', socket => {
  socket.on('add node', data => {
    socket.emit('node added', data)
  })
  console.log('socket connected server side');
  // // ALL SOCKET LISTENERS AND EMITTERS

  // socket.on('join room', async data => {
  //   socket.join(data.room);
  //   const roomData = await redis.get(`"${data.room}"`);
  //   io.to(socket.id).emit('room data', roomData);
  // });
});

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
