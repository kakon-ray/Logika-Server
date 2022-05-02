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

app.get("/", (req, res) => {
  res.send("Node server is running");
});

app.listen(port, () => {
  console.log("Node server is running");
});

var uri = `mongodb://${process.env.LOGIKA_USER}:${process.env.LOGIKA_PASS}@cluster0-shard-00-00.fx0p5.mongodb.net:27017,cluster0-shard-00-01.fx0p5.mongodb.net:27017,cluster0-shard-00-02.fx0p5.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-11zqww-shard-0&authSource=admin&retryWrites=true&w=majority`;

async function run() {
  try {
    let wareHouseCollection;
    await MongoClient.connect(uri, function (err, client) {
      wareHouseCollection = client
        .db("warehouse")
        .collection("warehouseProduct");
    });

    // get data database and send client side
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = wareHouseCollection.find(query);
      const wareHouseProduct = await cursor.toArray();
      res.send(wareHouseProduct);
    });
    // get data to database spesific id
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await wareHouseCollection.findOne(query);
      res.send(result);
    });

    // get data server spesific  email

    app.get("/userorder", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = wareHouseCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // add product item

    app.post("/product", async (req, res) => {
      const addItem = req.body;
      const result = await wareHouseCollection.insertOne(addItem);
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

    // delete spesific item spesific id
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await wareHouseCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir());
