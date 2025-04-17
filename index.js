const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c9gyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const db = client.db("job_apply");
    const allJobsColl = db.collection("alljobs");
    const applicationsColl = db.collection("applications");


    app.get("/allJobs", async (req, res) => {
      const result = await allJobsColl.find().toArray();
      res.send(result);
    });


    app.get("/allJobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allJobsColl.findOne(query);
      res.send(result);
    });


    app.post("/allJobs", async (req, res) => {
      const data = req.body;
      const result = await allJobsColl.insertOne(data);
      res.send(result);
    });



    app.get("/applications", async (req, res) => {
      const result = await applicationsColl.find().toArray();
      res.send(result);
    });

    app.post("/applications", async (req, res) => {
      try {
        const application = {
          ...req.body,
          submitted_At: new Date(),
          status: "pending"
        };
        const result = await applicationsColl.insertOne(application);
        res.status(201).json({ message: "Application submitted", id: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: "Error submitting application", error });
      }
    });

    app.delete("/applications/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await applicationsColl.deleteOne(query);
      res.send(result);
    });



  } finally {

  }
}

run().catch(console.dir);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
