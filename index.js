const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//mominulhoque
//nPBlGimG2d06EF5w
// use midleware 
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mominulhoque:nPBlGimG2d06EF5w@cluster0.qpjrn5d.mongodb.net/?retryWrites=true&w=majority";

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
        await client.connect();
        const notesCollection = client.db("notesTaker").collection("notes");

        // get api to read all notes
        // http://localhost:5000/notes
        app.get('/notes', async (req, res) => {
            const q = req.query;
            console.log(q);
            const cursor = notesCollection.find(q)
            const result = await cursor.toArray();
            res.send(result);
        })

        // create notestaker
        /**
         body{
    "userName":"Rahim",
    "textData":"Hello World 2"
}
         */
        // http://localhost:5000/note
        app.post('/note', async (req, res) => {
            const data = req.body;
            console.log("from post api", data);
            const result = await notesCollection.insertOne(data)
            res.send(result)
        })
        //update notestaker
        // localhost:5000/note/64dafbc738d96aee790af659
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log('from update api', data);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    userName: data.userName,
                    textData: data.textData,
                },
            };
            const result = await notesCollection.updateOne(filter, updateDoc, options);
            // console.log('from put method', id);
            res.send(result);
        })

        // delete notestaker
        // localhost:5000/note/64dafbc738d96aee790af659
        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await notesCollection.deleteOne(filter);
            res.send(result);
        })
        console.log('connected to db');
    } finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello world');
})

app.listen(port, () => {
    console.log('Listening to port', port);
})

