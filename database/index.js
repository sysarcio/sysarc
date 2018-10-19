const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(
  process.env.GRAPHENEDB_URI,
  neo4j.auth.basic(
    process.env.GRAPHENEDB_USERNAME,
    process.env.GRAPHENEDB_PASSWORD
  ),
  {disableLosslessIntegers: true}
);

const session = driver.session();

module.exports = {
  async addUser({ id, email, password }) {
    try {
      const newUser = await session.run(
        `
        CREATE (u:USER {id: $id, email: $email, password: $password})
        RETURN u.id`,
        {
          id: id,
          email: email,
          password: password
        }
      );
      session.close();
      return newUser.records[0];
    } catch (err) {
      throw err;
    }
  },

  async getUser({ email }) {
    try {
      const user = await session.run(
        `
        MATCH (u:USER {email: $email})
        RETURN u.id, u.email, u.password`,
        {
          email: email
        }
      );

      console.log(user);

      session.close();
      if (!user.records.length) {
        throw {
          message: `User not found with email address '${email}'`,
          code: 401
        };
      }
      
      return user.records[0];
    } catch (err) {
      throw err;
    }
  },

  async addCanvas({ userID, canvasID, canvasName }) {
    try {
      let result = await session.run(
        `
        MATCH (u:USER {id: $userID})
        CREATE (c:CANVAS {id: $canvasID, name: $canvasName})<-[:CAN_EDIT]-(u)
        RETURN c.id, c.name`,
        {
          userID: userID,
          canvasID: canvasID,
          canvasName: canvasName
        }
      );

      canvas = result.records[0];
      session.close();

      return canvas;
    } catch (err) {
      throw err;
    }
  },

  async deleteCanvas(canvasID) {
    try {
      await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})
        DETACH DELETE n;`,
        {
          canvasID: canvasID
        }
      );

      session.close();

      return;
    } catch(err) {
      throw err;
    }
  },

  async getCanvas(canvasID) {
    try {
      const result = await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})
        WITH n
        OPTIONAL MATCH (n)-[:CONTAINS]->(m)
        WITH m, n
        OPTIONAL MATCH (m)-[p:IS_CONNECTED]->(q)
        RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, n.name AS name, m.created_at AS created_at, collect(p) AS connections;`,
        {
          canvasID: canvasID
        }
      );

      session.close();

      return result.records;
    } catch (err) {
      throw err;
    }
  },

  async getUserCanvases(userID) {
    try {
      const result = await session.run(
        `
        MATCH (u:USER {id: $userID})
        WITH u
        OPTIONAL MATCH (u)-[r:CAN_EDIT]->(m)
        RETURN m.id AS id, m.name AS name, m.image AS image`,
        {
          userID: userID
        }
      );
      session.close();

      return result.records;
    } catch (err) {
      throw err;
    }
  },

  async addNode({ x, y, type, room, id }) {
    try {
      const result = await session.run(
        `
        MATCH (c:CANVAS {id: $room})
        CREATE (c)-[:CONTAINS]->(n:NODE {id: $id, x: $x, y: $y, created_at: timestamp(), type: $type})
        RETURN n.x AS x, n.y AS y, n.id AS id, n.type AS type`,
        {
          x,
          y,
          type,
          room,
          id
        }
      );

      session.close();
      return result.records[0];
    } catch (err) {
      throw err;
    }
  },

  async moveNode({ x, y, room, id }) {
    try {
      const result = await session.run(
        `
        MATCH (n:NODE {id: $nodeID})
        SET n.x = $x, n.y = $y
        RETURN n`,
        {
          canvasID: room,
          nodeID: id,
          x: x,
          y: y
        }
      );

      session.close();
      return result.records;
    } catch (err) {
      throw err;
    }
  },

  async deleteNode(id) {
    try {
      const result = await session.run(
        `
        MATCH (c:NODE {id: $nodeID})
        WITH c
        OPTIONAL MATCH (c)-[r:IS_CONNECTED]-(q)
        WITH c, r, collect(r.id) AS id
        DETACH DELETE c, r
        RETURN id`,
        {
          nodeID: id
        }
      );

      session.close();
      return result.records;
    } catch (err) {
      throw err;
    }
  },

  async deleteConnection(id) {
    try {
      await session.run(
        `
        MATCH (n)-[r:IS_CONNECTED{id: $id}]->(m)
        DETACH DELETE r
        `,
        {
          id: id
        }
      );

      session.close();
      return
    } catch (err) {
      throw err;
    }
  },

  async addConnection({connector, connectee, handleX, connectorLocation, connecteeLocation, handleY, room, id, data}) {
    data = JSON.stringify(data);
    try {
      const results = await session.run(
        `
        MATCH (c:CANVAS {id: $room})-[:CONTAINS]->(n:NODE {id: $connector})
        WITH n, c
        MATCH (c)-[:CONTAINS]->(m:NODE {id: $connectee})
        WITH n, m
        CREATE (n)-[r:IS_CONNECTED {
          id: $id,
          handleX: $handleX,
          handleY: $handleY,
          connector: $connector,
          connectee: $connectee,
          data: $data,
          connectorLocation: $connectorLocation,
          connecteeLocation: $connecteeLocation
        }]->(m)
        RETURN r.id AS id, r.handleX AS handleX, r.handleY AS handleY, r.connector AS connector, r.connectee AS connectee, r.data AS data, r.connectorLocation AS connectorLocation, r.connecteeLocation AS connecteeLocation;`,
        {
          connector,
          connectee,
          connectorLocation,
          connecteeLocation,
          handleX,
          handleY,
          room,
          id,
          data
        }
      );

      return results.records[0];
    } catch(err) {
      throw err;
    }
  },

  async updateConnection({data, handleX, handleY, id}) {
    data = JSON.stringify(data);
    try {
      const results = await session.run(
        `
        MATCH (a)-[r:IS_CONNECTED {id: $id}]->(b)
        WITH r
        SET r.handleX = $handleX, r.handleY = $handleY, r.data = $data
        RETURN r.id AS id, r.handleX AS handleX, r.handleY AS handleY, r.connector AS connector, r.connectee AS connectee, r.data AS data;`,
        {
          handleX,
          handleY,
          id,
          data
        }
      );
      return results.records[0];
    } catch(err) {
      throw err;
    }
  },

  async addImage(data) {
    try {
      const result = await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})
        SET n.image = $image
        return n;`,
        {
          canvasID: data.canvasID,
          image: data.image
        }
      );
      session.close();
      return result;
    } catch (err) {
      throw err;
    }
  }
};