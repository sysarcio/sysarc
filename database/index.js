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
        OPTIONAL MATCH (m)-[p:IS_CONNECTED]->(q)
        RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, m.created_at AS created_at, collect(p) AS connections;`,
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
        MATCH (c:CANVAS {id: $canvasID})
        CREATE (c)-[:CONTAINS]->(n:NODE {id: $nodeID, x: $x, y: $y, created_at: timestamp(), type: $type})
        RETURN n.x AS x, n.y AS y, n.id AS id, n.type AS type`,
        {
          canvasID: data.room,
          nodeID: data.nodeID,
          x: x,
          y: y,
          type: data.type
        }
      );

      session.close();
      return result.records[0];
    } catch (err) {
      console.log(err);
    }
  },

  async moveNode({ x, y, room, id }) {
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
          canvasID: room,
          nodeID: id,
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
      await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})-[r:CONTAINS]->(c:NODE {id: $nodeID})
        DETACH DELETE c, r`,
        {
          canvasID: room,
          nodeID: id
        }
      );

      session.close();
    } catch (err) {
      console.log(err);
    }
  },

  async addConnection(data) {
    console.log(data);
    try {
      await session.run(
        `
        MATCH (c:CANVAS {id: $room})-[:CONTAINS]->(n:NODE {id: $connector})
        WITH n, c
        MATCH (c)-[:CONTAINS]->(m:NODE {id: $connectee})
        WITH n, m
        CREATE (n)-[r:IS_CONNECTED {id: $id, handleX: $handleX, handleY: $handleY, connector: $connector, connectee: $connectee, description: '' }]->(m)
        return r.id as id, r.handleX as handleX, r.handleY as handleY, r.connector as connector, r.connectee as connectee, r.description as description;`
      )
    } catch(err) {
      return err;
    }
  },

  // async addRoute(data) {
  //   try {
  //     console.log('addRoute input data: ', data)
  //     const result = await session.run(
  //       `
  //       MATCH (c:CANVAS {id:$canvasID})-[:CONTAINS]->(o:NODE {id:$nodeID })
  //       CREATE (o)-[r:CONTAINS]->(n:ROUTE {id: $routeID, url: $url, method: $method})
  //       WITH o,n  
  //       MATCH (c:CANVAS {id: $canvasID })-[:CONTAINS]->(m)
  //       OPTIONAL MATCH (m)-[:CONTAINS]->(p)
  //       RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, m.created_at AS created_at, collect(p) AS routes;`,
  //       {
  //         canvasID: data.room,
  //         nodeID: data.id,
  //         url: data.url,
  //         method: data.method,
  //         routeID: data.routeID
  //       }
  //     );

  //     session.close();
  //     return result.records;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  // async updateRoute(data) {
  //   try {
  //     console.log('updateRoute input data: ', data);
  //     const result = await session.run(
  //       `
  //       MATCH (n:ROUTE {id: $routeID})
  //       SET n.url = $url, n.method = $method
  //       WITH n
  //       MATCH (c:CANVAS {id: $canvasID })-[:CONTAINS]->(m)
  //       OPTIONAL MATCH (m)-[:CONTAINS]->(p)
  //       RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, m.created_at AS created_at, collect(p) AS routes;`,
  //       {
  //         canvasID: data.room,
  //         url: data.url,
  //         method: data.method,
  //         routeID: data.routeID
  //       }
  //     );

  //     session.close();
  //     console.log('query result: ', result.records);
  //     return result.records;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  // async deleteRoute(data) {
  //   try {
  //     console.log('deleteRoute input data: ', data);
  //     const result = await session.run(
  //       `
  //       MATCH (o:NODE {id:$nodeID })-[b:CONTAINS]->(n:ROUTE {id: $routeID})
  //       DETACH DELETE b,n
  //       WITH o
  //       MATCH (c:CANVAS {id: $canvasID })-[:CONTAINS]->(m)
  //       OPTIONAL MATCH (m)-[:CONTAINS]->(p)
  //       RETURN m.id AS id, m.x AS x, m.y AS y, m.type AS type, m.created_at AS created_at, collect(p) AS routes;`,
  //       {
  //         canvasID: data.room,
  //         nodeID: data.nodeID,
  //         url: data.url,
  //         method: data.method,
  //         routeID: data.routeID
  //       }
  //     );

  //     session.close();
  //     console.log('query result: ', result.records);
  //     return result.records;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

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
