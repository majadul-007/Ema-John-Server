const express = require("express");
//const bodyParser = require('body-parser')
const cors = require('cors')
require("dotenv").config();
console.log(process.env.DB_USER);

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eigw8.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;

const port = 4000;

const MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("emajohn").collection("products");
  console.log("database connected");
  // perform actions on the collection object
  app.post("/addProduct", (req, res) => {
    const products = req.body;
    console.log(products)  
    productsCollection.insertMany(products)
    .then(result => {
        console.log(result.send);
        res.send(result.send(insertedCount))
    })
  });

  app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
})

app.post('/productsByKeys', (req, res) => {
  const productKeys = req.body;
  productsCollection.find({key: {$in: productKeys}})
  .toArray(  (err, documents) => {
    res.send(documents[0])
  })
})

  
});

app.get("/", (req, res) => {
  res.send("Hello Ema!");
});

app.listen(process.env.PORT || port);
