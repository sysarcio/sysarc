require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

const db = require('../database/index');

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
  console.log('socket connected server side');
  // ALL SOCKET LISTENERS AND EMITTERS
  socket.on('join room', async room => {
    socket.join(room);
    try {
      let nodes = await redis.lrange(`"${room}"`, 0, -1);
      nodes = nodes.map(node => JSON.parse(node));
      io.to(socket.id).emit('room data', nodes);
    } catch(err) {
      console.log(err);
    }
  });
  
  socket.on('add node', async data => {
    const {position, type} = data;
    try {
      await db.addNode({position, type});
      // const nodes = await
    } catch(err) {
      console.log(err);
    }
    // try {
    //   await redis.lpush([`"${data.room}"`, JSON.stringify({position, type})]);
    //   let nodes = await redis.lrange(`"${data.room}"`, 0, -1);
    //   nodes = nodes.map(node => JSON.parse(node));
    //   io.to(data.room).emit('node added', nodes);
    // } catch(err) {
    //   console.log('error from redis:', err);
    // }
  });
});

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
