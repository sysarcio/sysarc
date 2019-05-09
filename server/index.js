require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const routes = require("./routes");
const app = express();
app.use(express.json({ limit: "500kb" }));

const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

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

app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

io.on("connection", socket => {
  console.log("socket connected server side");

  socket.on("join room", roomID => {
    socket.join(roomID);
  });

  socket.on("add node", ({ id, x, y, type, room }) => {
    const node = { id, x, y, type };
    io.to(room).emit("node added", node);
    socket.emit("request screenshot");
  });

  socket.on("move node", ({ id, x, y, room }) => {
    io.to(room).emit("node moved", { id, x, y });
    // socket.emit('request screenshot');
  });

  socket.on("make connection", data => {
    io.to(data.room).emit("connection made", data.data);
    socket.emit("request screenshot");
  });

  socket.on("delete connection", ({ room, id }) => {
    io.to(room).emit("connection deleted", id);
    socket.emit("request screenshot");
  });

  socket.on("delete node", ({ room, id, connections }) => {
    io.to(room).emit("node deleted", { id, connections });
    socket.emit("request screenshot");
  });

  socket.on("update connection data", connection => {
    const { room } = connection;
    io.to(room).emit("connection updated", connection);
    socket.emit("request screenshot");
  });
});
