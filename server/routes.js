const express = require('express');
const db = require('../database/index');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');

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
    res.send(user.get('u.id'));
  } catch (err) {
    console.log(err);
    res.statusMessage = 'That email address is already in use';
    res.sendStatus(403);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await db.getUser(req.body);
    if (!user.get('u.email')) {
      throw {
        message: 'No user exists with this email',
        code: 401
      }
    }
    
    const valid = await bcrypt.compare(req.body.password, user.get('u.password'));
    if (!valid) {
      throw {
        message: 'Incorrect password',
        code: 401
      };
    }

    res.send(user.get('u.id'));
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(err.code);
  }
});

router.post('/canvas/add', async (req, res) => {
  const canvasID = uuidv4();

  try {
    if (!req.body.userID) {
      throw {
        message: 'User not logged in',
        code: 401
      };
    }
    const canvas = await db.addCanvas({
      userID: req.body.userID,
      canvasID,
      canvasName: req.body.name
    });
    res.send({ id: canvas.get('c.id'), name: canvas.get('c.name') });
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(err.code || 500);
  }
});

router.get('/canvases/:userID', async (req, res) => {
  try {
    if (!req.params.userID) {
      throw {
        message: 'User not logged in',
        code: 401
      }
    }

    const canvases = await db.getUserCanvases(req.params.userID);
    res.send(canvases);
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(err.code);
  }
});

router.delete('/canvas/:id', async (req, res) => {
  try {
    db.deleteCanvas(req.params.id);
    res.end();
  } catch(err) {
    res.sendStatus(500);
  }
});

router.get('/getRoomData/:id', async (req, res) => {
  try {
    const records = await db.getCanvas(req.params.id);
    const name = records[0].get('name');
    const [nodes, connections] = records.reduce((output, r) => {
      if (r.get('id') === null) return output;
      
      output[0][r.get('id')] = {
        id: r.get('id'),
        type: r.get('type'),
        x: r.get('x'),
        y: r.get('y')
      }

      r.get('connections').forEach(c => { 
        const {description, handleY, handleX, connectee, connector, connecteeLocation, connectorLocation, id, data} = c.properties;
        output[1][id] = {
          description,
          handleX,
          handleY,
          connectee,
          connector,
          connecteeLocation,
          connectorLocation,
          id,
          data: JSON.parse(data)
        }
      });
      return output;
    }, [{},{}]);
    
    res.send({nodes, connections, name});
  } catch(err) {
<<<<<<< HEAD
=======
    console.log(err);
  }
});

router.get('/Docs/:id', async (req, res) => {
  console.log('made it to server with id: ', req.params.id);
  try {
    const records = await db.getDocs(req.params.id);
    records.forEach((r, i) => {
      console.log(r);
      console.log(i);
    })
    const [connections] = records.reduce((output, r) => {
      r.get('connections').forEach(c => { 
        const {id, data} = c.properties;
        output[0][id] = {
          id,
          data: JSON.parse(data)
        }
      });
      return output;
    }, [{},{}]);
    console.log('formatted records: ', connections)
    // console.log('leaving server with records: ', records)
    res.send({connections});
    } catch(err) {
>>>>>>> 6be7715abc10fed59b8e78b1470f9a8b6e86667b
    console.log(err);
  }
});

module.exports = router;