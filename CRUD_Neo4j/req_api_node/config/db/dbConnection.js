const neo4j    = require('neo4j-driver');
const dbConfig = require('./dbConfig')


const dbConnection = async () => {
try {
const driver = neo4j.driver(dbConfig.URI, neo4j.auth.basic(dbConfig.USER, dbConfig.PASSWORD));

const serverInfo = await driver.getServerInfo();
console.log(`Conexão com o banco estabelecida com sucesso.`);
console.log(serverInfo)

} catch (err) {
  console.log(`Ocorreu o erro ${err}`)
}

}


module.exports = dbConnection