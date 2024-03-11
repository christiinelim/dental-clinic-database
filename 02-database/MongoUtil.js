const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

async function connect (uri, dbname) {
    const client = await MongoClient.connect(uri);

    const db = client.db(dbname);
    return db
}

module.exports = { connect }