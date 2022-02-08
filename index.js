const express = require('express')
const app = express()
const cors = require('cors');
require("dotenv").config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

// middle war
app.use(cors());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjjkl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

//  mongodb connection
async function run() {
    try {
        await client.connect();
        console.log("Database connected successfully");
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Cycle Ride Server!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})