const neo4j = require("neo4j-driver").v1;

const driver = neo4j.driver(
  process.env.GRAPHENEDB_URI,
  neo4j.auth.basic(
    process.env.GRAPHENEDB_USERNAME,
    process.env.GRAPHENEDB_PASSWORD
  ),
  { disableLosslessIntegers: true }
);

const User = require("./Models/User");
const Canvas = require("./Models/Canvas");
const Node = require("./Models/Node");
const Connection = require("./Models/Connection");

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
          return new User(user.get("user"));
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

          return new User(user.get("user"));
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

          return new Canvas(canvas.get("canvas"));
        });

      return canvas;
    } catch (err) {
      throw new Error(err);
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
    } catch (err) {
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
              const node = new Node(record.get("nodes"));
              output[0][node.id] = node;

              const connections = record
                .get("connections")
                .forEach(({ properties: connection }) => {
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
          session.close();

          const hasCanvas = records[0].get("canvas");
          if (!hasCanvas) {
            return [];
          }

          return records.map(record => new Canvas(record.get("canvas")));
        });

      return canvases;
    } catch (err) {
      throw new Error(err);
    }
  },

  async addNode(data) {
    try {
      const result = await session.run(
        `
        MATCH (c:CANVAS {id: $room})
        CREATE (c)-[:CONTAINS]->(n:NODE {id: $id, x: $x, y: $y, created_at: timestamp(), type: $type})
        RETURN n AS node`,
        data
      );

      session.close();
      return new Node(result.records[0].get("node"));
    } catch (err) {
      throw new Error(err);
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
      throw new Error(err);
    }
  },

  async deleteNode(nodeID) {
    try {
      const result = await session.run(
        `
        MATCH (c:NODE {id: $nodeID})
        WITH c
        OPTIONAL MATCH (c)-[r:IS_CONNECTED]-(q)
        WITH c, r, collect(r.id) AS id
        DETACH DELETE c, r
        RETURN id`,
        { nodeID }
      );

      session.close();
      return result.records;
    } catch (err) {
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
      throw new Error(err);
    }
  },

  async addConnection(data) {
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
        RETURN r AS connection;`,
        data
      );

      return new Connection(results.records[0].get("connection"));
    } catch (err) {
      throw new Error(err);
    }
  },

  async updateConnection(data) {
    data = JSON.stringify(data);
    try {
      const results = await session.run(
        `
        MATCH (a)-[r:IS_CONNECTED {id: $id}]->(b)
        WITH r
        SET r.handleX = $handleX, r.handleY = $handleY, r.data = $data
        RETURN r AS connection;`,
        { data }
      );
      return new Connection(results.records[0].get("connection"));
    } catch (err) {
      throw new Error(err);
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
      throw new Error(err);
    }
  },

  async getDocs(canvasID) {
    try {
      const result = await session.run(
        `
        MATCH (n:CANVAS {id: $canvasID})
        WITH n
        OPTIONAL MATCH (n)-[:CONTAINS]->(m)
        WITH m
        OPTIONAL MATCH (m)-[p:IS_CONNECTED]->(q)
        RETURN collect(p) AS connections`,
        {
          canvasID: canvasID
        }
      );
      session.close();

      return result.records;
    } catch (err) {
      throw new Error(err);
    }
  }
};
