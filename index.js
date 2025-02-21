const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cros = require("cors");
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cros());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.p5jac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const userCollection = client.db("taskManagement").collection("users");
const taskCollection = client.db("taskManagement").collection("tasks");
async function run() {
  try {
    app.post("/add-user", async (req, res) => {
      const user = req.body;
      const query = { userEmail: user?.userEmail };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        res.json({ message: "User already exists" });
      } else {
        const result = await userCollection.insertOne(user);
        res.json(result);
      }
    });
    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.json(result);
    });
    app.get("/tasks", async (req, res) => {
      const userId = req.query.userId;
      const query = { userId: userId };
      const result = await taskCollection.find(query).toArray();
      res.json(result);
    });
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Management system");
});
app.listen(port, () => {
  console.log(`🚩Server is running on port ${port}`);
});
