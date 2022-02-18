const express = require('express')
const app = express()
const cors = require('cors');
require("dotenv").config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// middle war
app.use(cors());
app.use(express.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjjkl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

//  mongodb connection
async function run() {
    try {
        await client.connect();
        // console.log("Database connected successfully");
        const database = client.db("cycle_Shop");
        const productsCollection = database.collection("products");
        const reviewCollection = database.collection("review");
        const usersCollection = database.collection("users");


        // get all products
        app.get("/allProducts", async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result);
        });

        // add products collection
        app.post("/addProducts", async (req, res) => {
            const addProducts = req.body;
            // console.log(addProducts);
            // res.json({ message: 'hello' })
            const result = await productsCollection.insertOne(addProducts);
            // console.log(result);
            res.send(result);
        });

        // single products details
        app.get("/productDetails/:id", async (req, res) => {
            const result = await productsCollection.findOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        // Delete product
        app.delete("/productItem/:id", async (req, res) => {
            const result = await productsCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.json(result);
            console.log(result);
        });

        // update Product
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const result = await productsCollection.updateOne(
                { _id: ObjectId(id) },
                {
                    $set: {
                        name: updateInfo.name,
                        price: updateInfo.price,
                        image: updateInfo.image,
                        category: updateInfo.category,
                        description: updateInfo.description,
                    },
                }
            );
            res.send(result);
        });

        // status Update
        app.put("/statusUpdate/:id", async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            const result = await ordersCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);
            console.log(result);
        });

        // review post
        app.post("/addReview", async (req, res) => {
            const result = await reviewCollection.insertOne(req.body);
            res.send(result);
        });

        // get review items
        app.get("/review", async (req, res) => {
            const result = await reviewCollection.find({}).toArray();
            res.send(result);
        });

        // get users
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user.role === "admin") {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });
        // user post
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.json(result);
        });

        // Upsert user
        app.put("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // make admin
        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            // const requester = req.decodedEmail;
            // if (requester) {
            //   const requsterAccount = await usersCollection.findOne({
            //     email: requester,
            //   });
            //   if (requsterAccount.role === "admin") {
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
            //   }
            // } else {
            //   res
            //     .status(403)
            //     .json({ message: "you do not have access to make admin" });
            // }
        });


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