const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(
  process.env.GRAPHENEDB_URI,
  neo4j.auth.basic(
    process.env.GRAPHENEDB_USERNAME,
    process.env.GRAPHENEDB_PASSWORD
  )
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
      console.log(err);
    }
  },

  async getCanvas(canvasID) {
    try {
      const result = await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})
        WITH n
        OPTIONAL MATCH (n)-[:CONTAINS]->(m)
        WITH m
        OPTIONAL MATCH (m)-[:CONTAINS]->(p)
        RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, m.created_at AS created_at, collect(p) AS routes;`,
        {
          canvasID: canvasID
        }
      );

      session.close();

      return result.records;
    } catch (err) {
      console.log(err);
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
      console.log(err);
    }
  },

  async addNode(data) {
    const { x, y } = data.position;
    try {
      const result = await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})
        CREATE (n)-[:CONTAINS]->(c:NODE {id: $nodeID, x: $x, y: $y, created_at: timestamp(), type: $type})
        WITH n
        MATCH (n)-[:CONTAINS]->(m)
        OPTIONAL MATCH (m)-[:CONTAINS]->(p)
        RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, m.created_at AS created_at, collect(p) AS routes;`,
        {
          canvasID: data.room,
          nodeID: data.nodeID,
          x: x,
          y: y,
          type: data.type
        }
      );

      session.close();
      return result.records;
    } catch (err) {
      console.log(err);
    }
  },

  async moveNode(data) {
    const { x, y } = data.position;
    try {
      const result = await session.run(
        `
        MATCH (n:NODE {id: $nodeID})
        SET n.x = $x, n.y = $y
        WITH n  
        MATCH (c:CANVAS {id: $canvasID })-[r:CONTAINS]->(m)
        OPTIONAL MATCH (m)-[:CONTAINS]->(p)
        RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, m.created_at AS created_at, collect(p) AS routes;`,
        {
          canvasID: data.room,
          nodeID: data.id,
          x: x,
          y: y
        }
      );

      session.close();
      return result.records;
    } catch (err) {
      console.log(err);
    }
  },

  async deleteNode({ room, id }) {
    try {
      const result = await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})-[r:CONTAINS]->(c:NODE {id: $nodeID})
        DETACH DELETE c, r
        WITH n  
        MATCH (c:CANVAS {id: $canvasID })-[:CONTAINS]->(m)
        OPTIONAL MATCH (m)-[:CONTAINS]->(p)
        RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, m.created_at AS created_at, collect(p) AS routes;`,
        {
          canvasID: room,
          nodeID: id
        }
      );

      session.close();
      return result.records;
    } catch (err) {
      console.log(err);
    }
  },

  async addRoute(data) {
    try {
      console.log('addRoute input data: ', data)
      const result = await session.run(
        `
        MATCH (c:CANVAS {id:$canvasID})-[:CONTAINS]->(o:NODE {id:$nodeID })
        CREATE (o)-[r:CONTAINS]->(n:ROUTE {id: $routeID, url: $url, method: $method})
        WITH o,n  
        MATCH (c:CANVAS {id: $canvasID })-[:CONTAINS]->(m)
        OPTIONAL MATCH (m)-[:CONTAINS]->(p)
        RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, m.created_at AS created_at, collect(p) AS routes;`,
        {
          canvasID: data.room,
          nodeID: data.id,
          url: data.url,
          method: data.method,
          routeID: data.routeID
        }
      );

      session.close();
      return result.records;
    } catch (err) {
      console.log(err);
    }
  },

  async updateRoute(data) {
    try {
      console.log('updateRoute input data: ', data);
      const result = await session.run(
        `
        MATCH (c:CANVAS {id:$canvasID})-[:CONTAINS]->(o:NODE {id:$nodeID })-[:CONTAINS]->(n:ROUTE {id: $routeID})
        SET n.url = $url
        WITH o,n  
        MATCH (c:CANVAS {id: $canvasID })-[:CONTAINS]->(m)
        OPTIONAL MATCH (m)-[:CONTAINS]->(p)
        RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, m.created_at AS created_at, collect(p) AS routes;`,
        {
          canvasID: data.room,
          nodeID: data.id,
          url: data.url,
          method: data.method,
          routeID: data.routeID
        }
      );

      session.close();
      console.log('query result: ', result.records);
      return result.records;
    } catch (err) {
      console.log(err);
    }
  },

  async deleteRoute(data) {
    try {
      console.log('deleteRoute input data: ', data);
      const result = await session.run(
        `
        MATCH (c:CANVAS {id:$canvasID})-[r:CONTAINS]->(o:NODE {id:$nodeID })-[b:CONTAINS]->(n:ROUTE {id: $routeID})
        DETACH DELETE b,n
        WITH o
        MATCH (c:CANVAS {id: $canvasID })-[:CONTAINS]->(m)
        OPTIONAL MATCH (m)-[:CONTAINS]->(p)
        RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, m.created_at AS created_at, collect(p) AS routes;`,
        {
          canvasID: data.room,
          nodeID: data.id,
          url: data.url,
          method: data.method,
          routeID: data.routeID
        }
      );

      session.close();
      console.log('query result: ', result.records);
      return result.records;
    } catch (err) {
      console.log(err);
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
      console.log(err);
    }
  }
};
