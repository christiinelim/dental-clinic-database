const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
require('dotenv').config();

const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

const app = express();

app.use(cors());
app.use(express.json());


async function connect (uri, dbname) {
    const client = await MongoClient.connect(uri, {
        useUnifiedTopology: true
    });

    const db = client.db(dbname);
    return db
}





async function main () {
    const uri = process.env.MONGO_URI;
    const db = await connect(uri, "dental-clinic");


    // READ
    app.get('/appointments', async (req, res) => {
        const result = await db.collection("appointments").find({}).toArray();

        res.json({
            'result': result
        })
    })


    // CREATE
    app.post('/appointment', (req, res) => {
        const date = req.body.date;
        const time = req.body.time;
        const dentist = req.body.time;
        const patient = req.body.time;
        const treatment = req.body.time;

        // validate date
        if (!isValidDate(date)) {
            res.status(400);
            res.json({
                "error": "Invalid date format given"
            });

            return
        }

        // validate time
        if (isValidTime(time)) {
            res.status(400);
            res.json({
                "error": "Invalid time format given"
            });

            return
        }

        // validate dentist

        // validate patient

        // validate treatment


        // combine datetime


        // convert dentist to id


        // convert patient to id

        // convert treatment to id


        // new Date(datetime)

    })


    // UPDATE



    // DELETE
}

main()





app.listen(3000, () => {
    console.log("Server has started")
})





// VALIDATION FUNCTIONS

// CHECK VALID DATE FORMAT
function isValidDate(dateInput) {
    const date = new Date(dateInput);

    return !isNaN(date.getTime()) && dateInput === date.toISOString().slice(0,10);
}

// CHECK VALID TIME FORMAT
function isValidTime(timeInput) {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!regex.test(timeInput)) {
        return false;
    }

    return true;
}