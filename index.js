const express = require("express");
require("dotenv").config();
const cors = require("cors");
var MongoClient = require("mongodb").MongoClient;
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
// username: admin
// password: 6iA57hoatUuBpTKZ

// middleware
app.use(cors());
app.use(express.json());

var uri = `mongodb://${process.env.LOGIKA_USER}:${process.env.LOGIKA_PASS}@cluster0-shard-00-00.fx0p5.mongodb.net:27017,cluster0-shard-00-01.fx0p5.mongodb.net:27017,cluster0-shard-00-02.fx0p5.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-11zqww-shard-0&authSource=admin&retryWrites=true&w=majority`;

async function run() {
  try {
    let wareHouseCollection;
    MongoClient.connect(uri, function (err, client) {
      wareHouseCollection = client
        .db("warehouse")
        .collection("warehouseProduct");
    });

    let userCollection;
    MongoClient.connect(uri, function (err, client) {
      userCollection = client.db("warehouse").collection("userProduct");
    });

    // get data database and send client side
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = wareHouseCollection.find(query);
      const wareHouseProduct = await cursor.toArray();
      res.send(wareHouseProduct);
    });

    // get data database all user product
    app.get("/userproduct", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const wareHouseProduct = await cursor.toArray();
      res.send(wareHouseProduct);
    });

    // get data to database spesific id product (wareHouseProduct)
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await wareHouseCollection.findOne(query);
      res.send(result);
    });

    // get data to database spesific id product (usercollection)
    app.get("/userproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // get data server spesific  email(usercollection)

    app.get("/userorder", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // add a item to main product collection
    app.post("/product", async (req, res) => {
      const addItem = req.body;
      const result = await wareHouseCollection.insertOne(addItem);
      res.send(result);
    });

    // add a item to usercollection

    app.post("/userproduct", async (req, res) => {
      const addItem = req.body;
      const result = await userCollection.insertOne(addItem);
      res.send(result);
    });

    // update quantity specific  id

    app.put("/product/:id", async (req, res) => {
      id = req.params.id;
      const updateQuantity = req.body;

      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDocument = {
        $set: {
          quantity: updateQuantity.quantity,
        },
      };

      const result = await wareHouseCollection.updateOne(
        filter,
        updateDocument,
        option
      );
      res.send(result);
    });

    // delete spesific item spesific id product (wareHouseCollection)
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await wareHouseCollection.deleteOne(query);
      res.send(result);
    });

    // delete spesific item spesific id product (usercollection)
    app.delete("/userproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir());

app.get("/", (req, res) => {
  res.send("Running ginius server");
});

// db users
app.listen(port, () => {
  console.log(`CROUD server is Running ${port}`);
});

// CORS Error solve
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
