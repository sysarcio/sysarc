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
    const user = await db.addUser(req.body);

    req.session.userID = user.get('u.id');
    console.log(req.session);
  } catch(err) {
    console.log(err);
    res.statusMessage = 'That email address is already in use';
    res.sendStatus(403);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await db.getUser(req.body);
    const valid = await bcrypt.compare(req.body.password, user.get('u.password'));
    
    if (!valid) {
      throw {
        message: 'Incorrect password',
        code: 401
      };
    }
    
    req.session.userID = user.get('u.id');
    console.log(req.session);

    res.send();
  } catch(err) {
    res.statusMessage = err.message;
    res.sendStatus(err.code);
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.end();
  });
});

router.post('/addCanvas', (req, res) => {
  console.log(req.session);
});

module.exports = router;