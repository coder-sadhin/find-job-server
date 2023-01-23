const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rybmrby.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const uri2 = `mongodb+srv://${process.env.DB_USER2}:${process.env.DB_PASSWORD2}@cluster0.bbbtstv.mongodb.net/?retryWrites=true&w=majority`;
const client2 = new MongoClient(uri2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

module.exports = { client, client2 };