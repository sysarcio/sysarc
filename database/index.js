const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(process.env.GRAPHENEDB_URI, neo4j.auth.basic(process.env.GRAPHENEDB_USERNAME, process.env.GRAPHENEDB_PASSWORD));

const session = driver.session();

module.exports = {
  async addNode(data) {
    const {position, type} = data;
    try {
      const result = await session.run(`CREATE (n:Node {x: ${position.x}, y: ${position.y}, type: '${type}'}) RETURN n`);
      console.log(result);
      session.close();
    } catch(err) {
      console.log(err);
    }
  }
}