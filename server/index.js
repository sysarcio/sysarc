require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const uuidv4 = require("uuid/v4");

const routes = require("./routes");
const app = express();
app.use(express.json({ limit: "500kb" }));

const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

const db = require("../database/index");

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

app.use(express.static(__dirname + "/../client/dist"));
app.use("/api", routes);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

io.on("connection", socket => {
  console.log("socket connected server side");

  socket.on("join room", roomID => {
    socket.join(roomID);
  });

  socket.on("add node", async data => {
    data.id = uuidv4();

    try {
      await db.addNode(data);
      const node = {
        x: data.x,
        y: data.y,
        type: data.type,
        id: data.id
      };
      io.to(data.room).emit("node added", node);
      socket.emit("request screenshot");
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("move node", ({ id, x, y, room }) => {
    io.to(room).emit("node moved", { id, x, y });
    // socket.emit('request screenshot');
  });

  socket.on("place node", async data => {
    const { id, x, y, room } = data;
    try {
      await db.moveNode(data);
      io.to(room).emit("node moved", { id, x, y });
      socket.emit("request screenshot");
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("make connection", async data => {
    data.id = uuidv4();
    try {
      await db.addConnection(data);
      io.to(data.room).emit("connection made", data);
      socket.emit("request screenshot");
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("drag connection", data => {
    io.to(data.room).emit("connection dragged", data);
  });

  socket.on("place connection", async data => {
    try {
      await db.updateConnection(data);
      io.to(data.room).emit("connection dragged", data);
      socket.emit("request screenshot");
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("delete connection", async ({ room, id }) => {
    try {
      await db.deleteConnection(id);
      io.to(room).emit("connection deleted", id);
      socket.emit("request screenshot");
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("delete node", async ({ room, id }) => {
    try {
      let connections = await db.deleteNode(id);
      connections = connections.map(c => c.get("id"));
      io.to(room).emit("node deleted", { id, connections });
      socket.emit("request screenshot");
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("update connection data", async connection => {
    const { room } = connection;
    try {
      await db.updateConnection(connection);
      io.to(room).emit("connection updated", connection);
      socket.emit("request screenshot");
    } catch (err) {
      console.log(err);
    }
  });
});

app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
