const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(process.env.GRAPHENEDB_URI, neo4j.auth.basic(process.env.GRAPHENEDB_USERNAME, process.env.GRAPHENEDB_PASSWORD));

const session = driver.session();

function formatNodes(data) {
  return data.records.map(record => {
    return {
      position: {
        x: neo4j.int(record.get('m.x')).toNumber(),
        y: neo4j.int(record.get('m.y')).toNumber()
      },
      id: record.get('m.id'),
      type: record.get('m.type')
    }
  });
}

module.exports = {
  async addCanvas(data) {
    try {
      const result = await session.run(`
        MERGE (n:CANVAS {id: 'newroom'})
        ON CREATE SET n.created_at = timestamp()
        WITH n
        MATCH (n)-[r:CONTAINS]->(m)
        RETURN m.id, m.x, m.y, m.type, m.created_at;`
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
        MATCH (n:CANVAS {id: '${data.room}'})
        CREATE (n)-[r:CONTAINS]->(c:${data.type} {id: '${data.nodeID}', x: ${x}, y: ${y}, created_at: timestamp(), type: '${data.type}'})
        WITH n
        MATCH (n)-[r:CONTAINS]->(m)
        RETURN m.id, m.x, m.y, m.type, m.created_at;`
      );

      const nodes = formatNodes(result);

      session.close();
      return nodes;
    } catch(err) {
      console.log(err);
    }
  }
}