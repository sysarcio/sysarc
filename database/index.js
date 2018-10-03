const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(process.env.GRAPHENEDB_URI, neo4j.auth.basic(process.env.GRAPHENEDB_USERNAME, process.env.GRAPHENEDB_PASSWORD));

const session = driver.session();

function formatNodes(data) {
  const output = {};

  data.records.forEach(record => {
    if (output[record.get('m.id')]) {
      output[record.get('m.id')].routes
        .push({
          id: record.get('p.id'),
          url: record.get('p.url'),
          method: record.get('p.method')
        })
    } else {
      output[record.get('m.id')] = {
        position: {
          x: neo4j.int(record.get('m.x')).toNumber(),
          y: neo4j.int(record.get('m.y')).toNumber()
        },
        id: record.get('m.id'),
        type: record.get('m.type'),
        routes: [{
          id: record.get('p.id'),
          url: record.get('p.url'),
          method: record.get('p.method')
        }]
      }
    }
  });

  return Object.values(output);
}

module.exports = {
  async addCanvas(canvasID) {
    try {
      const result = await session.run(`
        MERGE (n:CANVAS {id: $canvasID})
          ON CREATE SET n.created_at = timestamp()
        WITH n
        MATCH (n)-[r:CONTAINS]->(m)
        OPTIONAL MATCH (m)-[:CONTAINS]->(p)
        RETURN m.id, m.x, m.y, m.type, m.created_at, p.id, p.url, p.method;`,
        {canvasID: canvasID}
      );

      const nodes = formatNodes(result);
      session.close();

      return nodes;
    } catch(err) {
      console.log(err);
    }
  },

  async addNode(data) {
    const {x, y} = data.position;
    try {
      const result = await session.run(`
        MATCH (n:CANVAS {id: $canvasID})
        CREATE (n)-[r:CONTAINS]->(c:NODE {id: $nodeID, x: $x, y: $y, created_at: timestamp(), type: $type})
        WITH n
        MATCH (n)-[r:CONTAINS]->(m)
        OPTIONAL MATCH (m)-[:CONTAINS]->(p)
        RETURN m.id, m.x, m.y, m.type, m.created_at, p.id, p.url, p.method;`,
        {
          canvasID: data.room,
          nodeID: data.nodeID,
          x: x,
          y: y,
          type: data.type
        }
      );

      const nodes = formatNodes(result);

      session.close();
      return nodes;
    } catch(err) {
      console.log(err);
    }
  },

  async moveNode(data) {
    const {x, y} = data.position;
    try {
      const result = await session.run(`
        MATCH (n:NODE {id: $nodeID})
        SET n.x = $x, n.y = $y
        WITH n  
        MATCH (c:CANVAS {id: $canvasID })-[r:CONTAINS]->(m)
        OPTIONAL MATCH (m)-[:CONTAINS]->(p)
        RETURN m.id, m.x, m.y, m.type, m.created_at, p.id, p.url, p.method;`,
        {
          canvasID: data.room,
          nodeID: data.id,
          x: x,
          y: y
        }
      );

      const nodes = formatNodes(result);

      session.close();
      return nodes;
    } catch(err) {
      console.log(err);
    }
  },

  async deleteNode(data) {
    try {
      const result = await session.run(`
        MATCH (n:CANVAS {id: $canvasID})-[r:CONTAINS]->(c:NODE {id: $nodeID})
        DETACH DELETE c, r
        WITH n  
        MATCH (c:CANVAS {id: $canvasID })-[:CONTAINS]->(m)
        OPTIONAL MATCH (m)-[:CONTAINS]->(p)
        RETURN m.id, m.x, m.y, m.type, m.created_at, p.id, p.url, p.method;`,
        {
          canvasID: data.room,
          nodeID: data.id
        }
      );

      const nodes = formatNodes(result);

      session.close();
      return nodes;
    } catch(err) {
      console.log(err);
    }
  },

  async addRoute(data) {
    try {
      const result = await session.run(`
        MATCH (c:CANVAS {id:$canvasID})-[:CONTAINS]->(o:NODE {id:$nodeID })
        CREATE (o)-[r:CONTAINS]->(n:ROUTE {id: $routeID, url: $url, method: $method})
        WITH o,n  
        MATCH (c:CANVAS {id: $canvasID })-[:CONTAINS]->(m)-[:CONTAINS]->(p)
        RETURN m.id, m.x, m.y, m.type, m.created_at, p.id, p.url, p.method;`,
        {
          canvasID: data.room,
          nodeID: data.id,
          url: data.url,
          method: data.method,
          routeID: data.routeID
        }
      );

      const nodes = formatNodes(result);
      session.close();
      return nodes;
    } catch(err) {
      console.log(err);
    }
  }
}