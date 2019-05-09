const neo4j = require("neo4j-driver").v1;

const driver = neo4j.driver(
  process.env.GRAPHENEDB_URI,
  neo4j.auth.basic(
    process.env.GRAPHENEDB_USERNAME,
    process.env.GRAPHENEDB_PASSWORD
  ),
  { disableLosslessIntegers: true }
);

const session = driver.session();

module.exports = {
  async addUser({ id, email, password }) {
    try {
      const { records } = await session.run(
        `
        CREATE (user:USER {id: $id, email: $email, password: $password})
        RETURN user`,
        { id, email, password }
      );
      session.close();

      const newUser = records[0].get("user").properties;
      return newUser;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async getUser({ email }) {
    try {
      const { records } = await session.run(
        `
        MATCH (user:USER {email: $email})
        RETURN user`,
        { email }
      );
      session.close();

      const userRecord = records[0];
      if (!userRecord) {
        throw new Error(`User not found with email address '${email}'`);
      }

      const user = userRecord.get("user").properties;
      return user;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async addCanvas({ userID, canvasID, canvasName }) {
    try {
      const { records } = await session.run(
        `
        MATCH (u:USER {id: $userID})
        CREATE (c:CANVAS {id: $canvasID, name: $canvasName})<-[:CAN_EDIT]-(u)
        RETURN c AS canvas`,
        {
          userID,
          canvasID,
          canvasName
        }
      );
      session.close();

      const canvas = records[0].get("canvas").properties;
      return canvas;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async deleteCanvas(canvasID) {
    try {
      await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})
        DETACH DELETE n;`,
        { canvasID }
      );
      session.close();

      return canvasID;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async getCanvas(canvasID) {
    try {
      const { records } = await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})
        WITH n
        OPTIONAL MATCH (n)-[:CONTAINS]->(m)
        WITH m, n
        OPTIONAL MATCH (m)-[p:IS_CONNECTED]->(q)
        RETURN n AS canvas, m AS node, collect(p) AS connections;`,
        { canvasID }
      );
      session.close();

      const { name } = records[0].get("canvas").properties;
      const [nodes, connections] = records.reduce(
        (output, record) => {
          if (!record.get("node")) return output;

          const { properties: node } = record.get("node");
          output[0][node.id] = node;

          const connections = record.get("connections");
          connections.forEach(({ properties: connection }) => {
            connection.data = JSON.parse(connection.data);
            output[1][connection.id] = connection;
          });

          return output;
        },
        [{}, {}]
      );
      return { nodes, connections, name };
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async getUserCanvases(userID) {
    try {
      const { records } = await session.run(
        `
        MATCH (u:USER {id: $userID})
        WITH u
        OPTIONAL MATCH (u)-[r:CAN_EDIT]->(m:CANVAS)
        RETURN m AS canvas`,
        { userID }
      );
      session.close();

      const hasCanvas = records[0].get("canvas");
      if (!hasCanvas) {
        return [];
      }

      const canvases = records.map(
        record => record.get("canvas") && record.get("canvas").properties
      );

      return canvases;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async addNode(data) {
    try {
      const { records } = await session.run(
        `
        MATCH (c:CANVAS {id: $room})
        CREATE (c)-[:CONTAINS]->(n:NODE {id: $id, x: $x, y: $y, created_at: timestamp(), type: $type})
        RETURN n AS node`,
        data
      );
      session.close();
      const node = records[0].get("node").properties;

      return node;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async moveNode({ x, y, id }) {
    try {
      const { records } = await session.run(
        `
        MATCH (n:NODE {id: $id})
        SET n.x = $x, n.y = $y
        RETURN n AS node`,
        { id, x, y }
      );
      session.close();

      const node = records[0].get("node").properties;
      return node;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async deleteNode(nodeID) {
    try {
      const { records } = await session.run(
        `
        MATCH (c:NODE {id: $nodeID})
        WITH c
        OPTIONAL MATCH (c)-[r:IS_CONNECTED]-(q)
        WITH c, r, collect(r.id) AS connections
        DETACH DELETE c, r
        RETURN connections`,
        { nodeID }
      );
      session.close();
      const connections = records.map(record => record.get("connections"));

      return connections;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async deleteConnection(id) {
    try {
      await session.run(
        `
        MATCH (n)-[r:IS_CONNECTED{id: $id}]->(m)
        DETACH DELETE r
        `,
        { id }
      );

      session.close();
      return id;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async addConnection(data) {
    try {
      const { records } = await session.run(
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
        RETURN r AS connection;`,
        data
      );
      session.close();

      const connection = records[0].get("connection").properties;
      connection.data = JSON.parse(connection.data);

      return connection;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async updateConnection(connection) {
    connection.data = JSON.stringify(connection.data);
    const { id, handleX, handleY, data } = connection;
    try {
      const { records } = await session.run(
        `
        MATCH (a)-[r:IS_CONNECTED {id: $id}]->(b)
        WITH r
        SET r.handleX = $handleX, r.handleY = $handleY, r.data = $data
        RETURN r AS connection;`,
        { id, handleX, handleY, data }
      );
      session.close();

      const connection = records[0].get("connection").properties;

      return connection;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async addImage({ canvasID, image }) {
    try {
      const result = await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})
        SET n.image = $image
        return n;`,
        { canvasID, image }
      );
      session.close();

      return result;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async getDocs(canvasID) {
    try {
      const { records } = await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})
        WITH n
        OPTIONAL MATCH (n)-[:CONTAINS]->(m)
        WITH m
        OPTIONAL MATCH (m)-[p:IS_CONNECTED]->(q)
        RETURN collect(p) AS connections`,
        { canvasID }
      );
      session.close();

      return records;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  }
};
