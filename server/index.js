require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const uuidv4 = require('uuid/v4');
const session = require('express-session');

const routes = require('./routes');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

const db = require('../database/index');

app.use(session({
  secret: 'my session secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // Set max age to one week
  }
}));

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
  
  socket.on('join room', roomID => {
    socket.join(roomID);
  });

  socket.on('move node', ({id, x, y, room}) => {
    io.to(room).emit('node moved', {id, x, y});
  });

  socket.on('place node', async data => {
    const {id, x, y, room} = data;
    try {
      await db.moveNode(data);
      io.to(room).emit('node moved', {id, x, y});
    } catch(err) {
      console.log(err);
    }
  });

  socket.on('make connection', async data => {
    data.id = uuidv4();
    
    try {
      await db.addConnection(data);
      io.to(data.room).emit('connection made', data);
    } catch(err) {
      console.log(err);
    }
  });

  socket.on('drag connection', data => {
    io.to(data.room).emit('connection dragged', data);
  });

  socket.on('place connection', async data => {
    try {
      await db.updateConnection(data);
      io.to(data.room).emit('connection dragged', data);
    } catch(err) {
      console.log(err);
    }
  });

  socket.on('delete connection', async ({room, id}) => {
    try {
      await db.deleteConnection(id);
      io.to(room).emit('connection deleted', id);
    } catch(err) {
      console.log(err);
    }
  });
  
  socket.on('delete node', async ({room, id}) => {
    try {
      let connections = await db.deleteNode(id);
      connections = connections.map(c => c.get('id'));
      io.to(room).emit('node deleted', {id, connections});
    } catch(err) {
      console.log(err);
    }
  })
  
  // socket.on('add node', async data => {
  //   data.nodeID = uuidv4();

  //   try {
  //     const node = await db.addNode(data);
  //     // io.to(data.room).emit('room data', nodes);
  //     io.to(data.room).emit('node added', node);
  //   } catch(err) {
  //     console.log(err);
  //   }
  // });

  // socket.on('delete node', async data => {
  //   try {
  //     await db.deleteNode(data);
  //     // io.to(data.room).emit('room data', nodes);
  //     io.to(data.room).emit('node deleted', data.id);
  //   } catch(err) {
  //     console.log(err);
  //   }
  // });

  // socket.on('add route', async data => {
  //   data.routeID = uuidv4();

  //   try {
  //     console.log('add route data: ', data);
  //     const nodes = await db.addRoute(data);
  //     io.to(data.room).emit('room data', nodes);
  //     // io.to(data.room).emit('route added', nodes);
  //   } catch(err) {
  //     console.log(err);
  //   }
  // });

  // socket.on('update route', async data => {

  //   try {
  //     console.log('update route data: ', data);
  //     const nodes = await db.updateRoute(data);
  //     console.log('server data: ', nodes);
  //     io.to(data.room).emit('room data', nodes);
  //     // io.to(data.room).emit('route updated', nodes);
  //   } catch(err) {
  //     console.log(err);
  //   }
  // });

  // socket.on('delete route', async data => {

  //   try {
  //     console.log('delete route data: ', data);
  //     const nodes = await db.deleteRoute(data);
  //     console.log('server data: ', nodes);
  //     io.to(data.room).emit('room data', nodes);
  //     // io.to(data.room).emit('route deleted', nodes);
  //   } catch(err) {
  //     console.log(err);
  //   }
  // });
});


app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
