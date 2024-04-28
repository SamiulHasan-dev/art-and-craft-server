const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(express.json())
app.use(cors())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qdflpzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // const craftCollection = client.db("craftDb").collection("craft");
    const database = client.db("craftDb");
    const craftCollection = database.collection("craft");


    app.get('/crafts', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.findOne(query);
      res.send(result);
    })


    app.put('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = {upsert: true}
      const updatedCraft = req.body;
      const craft = {
        $set: {
          photo : updatedCraft.photo,
          item : updatedCraft.item,
          sub : updatedCraft.sub,
          price : updatedCraft.price,
          rating : updatedCraft.rating,
          customize : updatedCraft.customize,
          processing : updatedCraft.processing,
          stock : updatedCraft.stock,
          description : updatedCraft.description
        }
      }

      const result = await craftCollection.updateOne(filter, craft, options);
      res.send(result)
    })



    app.get('/craftsMail/:email', async (req, res) => {
      console.log(req.params.email)
      const myEmail = req.params.email;
      const query = { email: myEmail };
      console.log(myEmail)
      const result = await craftCollection.find(query).toArray();
      res.send(result);
    })


    app.post('/crafts', async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft)
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Crafter-Cove server is started')
})

app.listen(port, () => {
  console.log(`My server is running on ${port}`);
})