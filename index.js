const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { config } = require('dotenv');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Test server is running');
})

// making connection with MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@furniture-inventory-man.tnveo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const dataCollection = client.db("inventory").collection("dataCollection");

        // post data on database for store data
        app.post('/storeData', async (req, res) => {
            const data = req.body;
            const result = await dataCollection.insertOne(data);
            res.send(result);
        })

        // get all data from data base
        app.get('/getData', async (req, res) => {
            const data = await dataCollection.find().toArray();
            res.send(data);
        })

        // delete data from data base
        app.delete('/deleteData/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await dataCollection.deleteOne(filter);
      
            res.send(result);
        });
        // update data 
        app.put('/updateData/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedData = req.body;
            const options = {upsert: true}
            console.log(updatedData);
            const updatedDoc = {
                $set: { 
                    title: updatedData.updateTitle,
                    description:updatedData.updateDescription ,
                    status: updatedData.updateStatus,
                    time:updatedData.updateTime
              }
        
            }
            const result = await dataCollection.updateOne(filter, updatedDoc, options);
           
            res.send(result);
            
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`listening port ${port}`);
})