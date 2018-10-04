const express = require('express');
const db = require('../database/index');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    await db.addUser(req.body);
    res.send('Successfully logged in. Redirect to home page');
  } catch(err) {
    console.log(err);
    res.status(500).send('There was a problem logging in, keep them here');
  }
});

module.exports = router;