const express = require("express");
const db = require("../database/index");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/uploadScreenshot", async (req, res) => {
  try {
    const canvas = await db.addImage({
      canvasID: req.body.canvasID,
      image: req.body.image
    });
    res.send("screenshot added!");
  } catch (err) {
    console.log(err);
    res.statusMessage = err.message;
    res.sendStatus(err.code);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const email = req.body.email;
    const id = uuidv4();
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await db.addUser({ email, id, password });
    res.json(user.id);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await db.getUser(req.body);
    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
      return res.sendStatus(401);
    }

    res.json(user.id);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/canvas", async (req, res) => {
  const canvasID = uuidv4();

  try {
    if (!req.body.userID) {
      throw new Error("User not logged in");
    }
    const canvas = await db.addCanvas({
      userID: req.body.userID,
      canvasID,
      canvasName: req.body.name
    });

    res.json(canvas);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete("/canvas/:canvasID", async (req, res) => {
  try {
    db.deleteCanvas(req.params.canvasID);
    res.end();
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post("/canvas/:canvasID/nodes", async (req, res) => {
  req.body.id = uuidv4();

  try {
    const node = await db.addNode(req.body);
    res.json(node);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.put("/canvas/:canvasID/nodes/:id", async (req, res) => {
  try {
    const node = await db.moveNode(req.body);
    res.json(node);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete("/canvas/:canvasID/nodes/:id", async (req, res) => {
  try {
    const connections = await db.deleteNode(req.params.id);
    res.json(connections);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get("/canvases", async (req, res) => {
  try {
    const userID = req.query.userID;
    if (!userID) {
      throw new Error("User not logged in");
    }

    const canvases = await db.getUserCanvases(userID);

    res.json(canvases);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post("/canvas/:canvasID/connections", async (req, res) => {
  try {
    req.body.id = uuidv4();
    const connection = await db.addConnection(req.body);
    res.json(connection);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete("/canvas/:canvasID/connections/:id", async (req, res) => {
  try {
    await db.deleteConnection(req.params.id);
    res.end();
  } catch (err) {
    res.sendStatus(500);
  }
});

router.put("/canvas/:canvasID/connections/:id", async (req, res) => {
  try {
    const connection = await db.updateConnection(req.body);
    res.json(connection);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get("/getRoomData/:id", async (req, res) => {
  try {
    const data = await db.getCanvas(req.params.id);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.get("/Docs/:id", async (req, res) => {
  try {
    const records = await db.getDocs(req.params.id);
    const [connections] = records.reduce(
      (output, r) => {
        r.get("connections").forEach(c => {
          const { id, data } = c.properties;
          output[0][id] = {
            id,
            data: JSON.parse(data)
          };
        });
        return output;
      },
      [{}, {}]
    );

    res.json({ connections });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
