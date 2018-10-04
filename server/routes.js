const express = require('express');
const db = require('../database/index');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/signup', async (req, res) => {
  req.body.id = uuidv4();
  
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    req.body.password = password;
    await db.addUser(req.body);
    res.send('Successfully signed up. Redirect to home page');
  } catch(err) {
    console.log(err);
    res.statusMessage = 'That email address is already in use';
    res.sendStatus(403);
  }
});

router.post('/signup', async (req, res) => {
  try {
    // const password = await bcrypt.compare(req.body.password, 10);
    // req.body.password = password;
    const user = await db.getUser(req.body);
    res.send('Successfully logged in. Redirect to home page');
  } catch(err) {
    console.log(err);
    res.statusMessage = 'Unable to sign in';
    res.sendStatus(403);
  }
});

module.exports = router;