const neo4j = require("neo4j-driver").v1;

const driver = neo4j.driver(
  process.env.DB_URI,
  neo4j.auth.basic(process.env.DB_USERNAME, process.env.DB_PASSWORD),
  { disableLosslessIntegers: true }
);

const session = driver.session();

module.exports = {
  async addUser({ id, email, password }) {
    try {
      const newUser = await session
        .run(
          `
        CREATE (user:USER {id: $id, email: $email, password: $password})
        RETURN user`,
          { id, email, password }
        )
        .then(({ records: [user] }) => {
          session.close();
          return user.get("user").properties;
        });
      return newUser;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async getUser({ email }) {
    try {
      const user = await session
        .run(
          `
        MATCH (user:USER {email: $email})
        RETURN user`,
          { email }
        )
        .then(({ records: [user] }) => {
          session.close();

          if (!user) {
            throw new Error(`User not found with email address '${email}'`);
          }

          return user.get("user").properties;
        });

      return user;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async addCanvas({ userID, canvasID, canvasName }) {
    try {
      const canvas = await session
        .run(
          `
        MATCH (u:USER {id: $userID})
        CREATE (c:CANVAS {id: $canvasID, name: $canvasName})<-[:CAN_EDIT]-(u)
        RETURN c AS canvas`,
          {
            userID,
            canvasID,
            canvasName
          }
        )
        .then(({ records: [canvas] }) => {
          session.close();

          return canvas.get("canvas").properties;
        });

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
      const data = await session
        .run(
          `
        MATCH (n:CANVAS {id: $canvasID})
        WITH n
        OPTIONAL MATCH (n)-[:CONTAINS]->(m)
        WITH m, n
        OPTIONAL MATCH (m)-[p:IS_CONNECTED]->(q)
        RETURN n AS canvas, m AS nodes, collect(p) AS connections;`,
          { canvasID }
        )
        .then(({ records }) => {
          session.close();
          const { name } = records[0].get("canvas").properties;

          const [nodes, connections] = records.reduce(
            (output, record) => {
              if (!record.get("nodes")) return output;

              const { properties: node } = record.get("nodes");
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
        });

      return data;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async getUserCanvases(userID) {
    try {
      const canvases = await session
        .run(
          `
        MATCH (u:USER {id: $userID})
        WITH u
        OPTIONAL MATCH (u)-[r:CAN_EDIT]->(m:CANVAS)
        RETURN m AS canvas`,
          { userID }
        )
        .then(({ records }) => {
          const hasCanvas = records[0].get("canvas");
          if (!hasCanvas) return [];

          return records.map(record => record.get("canvas").properties);
        });

      session.close();
      return canvases;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async addNode(data) {
    try {
      const node = await session
        .run(
          `
        MATCH (c:CANVAS {id: $room})
        CREATE (c)-[:CONTAINS]->(n:NODE {id: $id, x: $x, y: $y, created_at: timestamp(), type: $type})
        RETURN n AS node`,
          data
        )
        .then(({ records: [node] }) => node.get("node").properties);

      session.close();
      return node;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async moveNode({ x, y, id }) {
    try {
      const node = await session
        .run(
          `
        MATCH (n:NODE {id: $id})
        SET n.x = $x, n.y = $y
        RETURN n AS node`,
          { id, x, y }
        )
        .then(({ records: [node] }) => node.get("node").properties);

      session.close();
      return node;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async deleteNode(nodeID) {
    try {
      const results = await session
        .run(
          `
        MATCH (c:NODE {id: $nodeID})
        WITH c
        OPTIONAL MATCH (c)-[r:IS_CONNECTED]-(q)
        WITH c, r, collect(r.id) AS connections
        DETACH DELETE c, r
        RETURN connections`,
          { nodeID }
        )
        .then(({ records }) =>
          records.map(record => record.get("connections"))
        );
      session.close();
      return results;
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
      return;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async addConnection(data) {
    try {
      const connection = await session
        .run(
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
        )
        .then(({ records: [connection] }) => connection);

      session.close();
      const { properties } = connection.get("connection");
      properties.data = JSON.parse(properties.data);
      return properties;
    } catch (err) {
      session.close();
      throw new Error(err);
    }
  },

  async updateConnection(connection) {
    connection.data = JSON.stringify(connection.data);
    const { handleX, handleY, data, id } = connection;
    try {
      const connection = await session
        .run(
          `
        MATCH (a)-[r:IS_CONNECTED {id: $id}]->(b)
        WITH r
        SET r.handleX = $handleX, r.handleY = $handleY, r.data = $data
        RETURN r AS connection;`,
          { id, handleX, handleY, data }
        )
        .then(({ records: [conn] }) => conn.get("connection").properties);

      session.close();
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
