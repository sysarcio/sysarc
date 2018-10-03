require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const uuidv4 = require('uuid/v4');

const routes = require('./routes');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

const db = require('../database/index');

// const Redis = require('ioredis');
// const redis = new Redis({
//   port: process.env.REDIS_PORT,
//   host: process.env.REDIS_HOST,
//   password: process.env.REDIS_PASSWORD
// });

// redis.on('connect', () => {
//   console.log('Redis connected successfully');
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../client/dist'));

app.use('/api', routes);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

io.on('connection', socket => {
  console.log('socket connected server side');
  
  socket.on('join room', async room => {
    socket.join(room);

    try {
      const nodes = await db.addCanvas(room);
      io.to(room).emit('room data', nodes);
    } catch(err) {
      console.log(err);
    }
  });

  socket.on('move node', async data => {
    try {
      const nodes = await db.moveNode(data);
      io.to(data.room).emit('node moved', nodes);
    } catch(err) {
      console.log(err);
    }

  });
  
  socket.on('add node', async data => {
    data.nodeID = uuidv4();

    try {
      const nodes = await db.addNode(data);
      io.to(data.room).emit('node added', nodes);
    } catch(err) {
      console.log(err);
    }
  });

  socket.on('delete node', async data => {
    try {
      const nodes = await db.deleteNode(data);
      io.to(data.room).emit('node deleted', nodes);
    } catch(err) {
      console.log(err);
    }
  });
});

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
