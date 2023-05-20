const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mv9nczj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const sportsToysCollection = client.db("sportsToy").collection("toys");

    // get all toys
    app.get('/alltoys', async (req, res) => {
        const cursor = sportsToysCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    // post a new toy
    app.post('/addToy', async (req, res) => {
        const newToy = req.body;
        const result = await sportsToysCollection.insertOne(newToy);
        console.log('Got new Toy', result);
        res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// Routes
app.get('/', (req, res) => {    
    res.send('Sports Toys Api running...');
});

app.listen(port, () => {
    console.log(`Assignment 11 Server is running on port: ${port}`);
});