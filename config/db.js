const oracledb = require('oracledb');

const dbConfig = {
  user: 'rm97784',
  password: '081100',
  connectString: 'oracle.fiap.com.br:1521/orcl'
};

async function initialize() {
  try {
    await oracledb.createPool(dbConfig);
    console.log('Connection pool started');
  } catch (err) {
    console.error('Error initializing database pool', err);
    throw err;
  }
}

async function close() {
  await oracledb.getPool().close();
  console.log('Connection pool closed');
}

module.exports = { initialize, close };
