const express = require('express');
const db = require('../database/index');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const LZString = require('lz-string');

const router = express.Router();

router.post('/uploadScreenshot', async (req, res) => {
  try {
    const canvas = await db.addImage({
      canvasID: req.body.canvasID,
      image: req.body.image
    });
    res.send('screenshot added!');
  } catch (err) {
    console.log(err);
    res.statusMessage = err.message;
    res.sendStatus(err.code);
  }
});

router.post('/signup', async (req, res) => {
  req.body.id = uuidv4();

  try {
    const password = await bcrypt.hash(req.body.password, 10);
    req.body.password = password;
    const user = await db.addUser(req.body);

    req.session.userID = user.get('u.id');
    res.end();
  } catch (err) {
    console.log(err);
    res.statusMessage = 'That email address is already in use';
    res.sendStatus(403);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await db.getUser(req.body);
    const valid = await bcrypt.compare(
      req.body.password,
      user.get('u.password')
    );

    if (!valid) {
      throw {
        message: 'Incorrect password',
        code: 401
      };
    }

    req.session.userID = user.get('u.id');

    res.end();
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(err.code);
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.end();
  });
});

router.post('/canvas/add', async (req, res) => {
  const canvasID = uuidv4();

  try {
    if (!req.session.userID) {
      throw {
        message: 'User not logged in',
        code: 401
      };
    }
    const canvas = await db.addCanvas({
      userID: req.session.userID,
      canvasID,
      canvasName: req.body.name
    });
    res.send({ id: canvas.get('c.id'), name: canvas.get('c.name') });
  } catch (err) {
    console.log(err);
    res.statusMessage = err.message;
    res.sendStatus(err.code);
  }
});

router.get('/canvases', async (req, res) => {
  try {
    if (!req.session.userID) {
      throw {
        message: 'User not logged in',
        code: 401
      };
    }

    const canvases = await db.getUserCanvases(req.session.userID);
    res.send(canvases);
  } catch (err) {
    console.log(err);
    res.statusMessage = err.message;
    res.sendStatus(err.code);
  }
});

module.exports = router;
