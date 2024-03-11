const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const { connect } = require('./MongoUtil');
const { authenticateWithJWT } = require('./middleware');

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;


function generateAccessToken(id, email) {
    return jwt.sign({
        "user_id": id,
        "email": email
    }, process.env.TOKEN_SECRET, {
        "expiresIn": "3d"
    });
}


async function main () {
    const db = await connect(MONGO_URI, DB_NAME);


    // READ
    app.get('/api/appointments', async (req, res) => {
        try {
            const criteria = {};
            let patientId = {}

            if (req.query.name) {
                criteria.name = {
                    '$regex': req.query.name,
                    '$options': 'i'
                }
                const queryResult = await db.collection("patients").find({
                    "name": criteria.name
                }, {
                    "_id": 1
                }).toArray();
    
                if (queryResult.length > 0){
                    patientId["patientId"] = queryResult[0]._id;
                } else {
                    res.status(500);
                    res.json({
                        "error": "No such patient in the database"
                    })
                }
            }

            const result = await db.collection("appointments").find(patientId).toArray();
            

            res.json({
                'result': result
            })
        } catch (e) {
            res.status(500);
            res.json({
                "error": e.message
            });
        }
    })


    // CREATE
    app.post('/api/appointment', async (req, res) => {
        try {

            const { date, time, dentist, patient, treatment } = req.body;

            let dentistId, patientId;
            let treatmentId = [];

            // validate date
            if (!date){
                res.status(400);
                res.json({
                    "error": "Please input a date"
                });

                return;
            } else if (!isValidDate(date)) {
                res.status(400);
                res.json({
                    "error": "Invalid date format given"
                });

                return;
            }

            // validate time
            if (!time){
                res.status(400);
                res.json({
                    "error": "Please input a time"
                });

                return;
            } else if (!isValidTime(time)) {
                res.status(400);
                res.json({
                    "error": "Invalid time format given"
                });

                return;
            }

            // combine datetime
            const dateTimeString = `${date}T${time}`;
            const dateTime = new Date(dateTimeString);

            // validate dentist
            if (!dentist){
                res.status(400);
                res.json({
                    "error": "Please input dentist in charge"
                });

                return;
            } 

            const dentistMatch = await db.collection('dentists').find({
                'name': dentist
            }, {
                '_id': 1,
                'name': 1
            }).toArray();

            if (dentistMatch.length < 1){
                res.status(400);
                res.json({
                    "error": "Dentist not in database"
                });
                return;
            } else {
                dentistId = dentistMatch[0]._id;
            }

            // validate patient
            if (!patient){
                res.status(400);
                res.json({
                    "error": "Please input patient"
                });

                return;
            }

            const patientMatch = await db.collection('patients').find({
                'name': patient
            }, {
                '_id': 1,
                'name': 1
            }).toArray();

            if (patientMatch.length < 1) {
                res.status(400);
                res.json({
                    "error": "Patient not in database"
                });
                return;
            } else {
                patientId = patientMatch[0]._id;
            }

            // validate treatment
            if (!treatment || treatment.length == 0) {
                res.status(400);
                res.json({
                    "error": "Please input treatment"
                });
                return;
            } else if (!Array.isArray(treatment)) {
                res.status(400);
                res.json({
                    "error": "Please treatment input must be an array"
                });
                return;
            } else {
                for (let t of treatment) {
                    const treatmentMatch = await db.collection('treatments').find({
                        "treatment": t
                    }, {
                        '_id': 1,
                        "treatment": 1
                    }).toArray();

                    if (treatmentMatch.length < 1){
                        treatmentId.push(null);
                    } else {
                        treatmentId.push(treatmentMatch[0]._id)
                    }
                }

                if (treatmentId.includes(null)) {
                    res.status(400);
                    res.json({
                        "error": "One or more treatments not found"
                    });
                    return;
                }
            }

            const appointment = await db.collection("appointments").insertOne({
                'dateTime': dateTime,
                "dentistId": dentistId,
                "patientId": patientId,
                "treatmentId": treatmentId
            }) 

            res.json({
                "appointments": appointment
            })
        } catch (e) {
            res.status(500);
            res.json({
                "error": e.message
            })
        }
    })


    // UPDATE
    app.put('/api/appointment/:id', async (req, res) => {
        try {
            const { date, time, dentist, patient, treatment } = req.body;

            let dentistId, patientId;
            let treatmentId = [];

            // validate date
            if (!date){
                res.status(400);
                res.json({
                    "error": "Please input a date"
                });

                return;
            } else if (!isValidDate(date)) {
                res.status(400);
                res.json({
                    "error": "Invalid date format given"
                });

                return;
            }

            // validate time
            if (!time){
                res.status(400);
                res.json({
                    "error": "Please input a time"
                });

                return;
            } else if (!isValidTime(time)) {
                res.status(400);
                res.json({
                    "error": "Invalid time format given"
                });

                return;
            }

            // combine datetime
            const dateTimeString = `${date}T${time}`;
            const dateTime = new Date(dateTimeString);

            // validate dentist
            if (!dentist){
                res.status(400);
                res.json({
                    "error": "Please input dentist in charge"
                });

                return;
            } 

            const dentistMatch = await db.collection('dentists').find({
                'name': dentist
            }, {
                '_id': 1,
                'name': 1
            }).toArray();

            if (dentistMatch.length < 1){
                res.status(400);
                res.json({
                    "error": "Dentist not in database"
                });
                return;
            } else {
                dentistId = dentistMatch[0]._id;
            }

            // validate patient
            if (!patient){
                res.status(400);
                res.json({
                    "error": "Please input patient"
                });

                return;
            }

            const patientMatch = await db.collection('patients').find({
                'name': patient
            }, {
                '_id': 1,
                'name': 1
            }).toArray();

            if (patientMatch.length < 1) {
                res.status(400);
                res.json({
                    "error": "Patient not in database"
                });
                return;
            } else {
                patientId = patientMatch[0]._id;
            }

            // validate treatment
            if (!treatment || treatment.length == 0) {
                res.status(400);
                res.json({
                    "error": "Please input treatment"
                });
                return;
            } else if (!Array.isArray(treatment)) {
                res.status(400);
                res.json({
                    "error": "Please treatment input must be an array"
                });
                return;
            } else {
                for (let t of treatment) {
                    const treatmentMatch = await db.collection('treatments').find({
                        "treatment": t
                    }, {
                        '_id': 1,
                        "treatment": 1
                    }).toArray();

                    if (treatmentMatch.length < 1){
                        treatmentId.push(null);
                    } else {
                        treatmentId.push(treatmentMatch[0]._id)
                    }
                }

                if (treatmentId.includes(null)) {
                    res.status(400);
                    res.json({
                        "error": "One or more treatments not found"
                    });
                    return;
                }
            }

            const appointment = await db.collection("appointments").updateOne({
                "_id": new ObjectId(req.params.id)
            }, {
                "$set": {
                    'dateTime': dateTime,
                    "dentistId": dentistId,
                    "patientId": patientId,
                    "treatmentId": treatmentId
                }
            }) 

            res.json({
                "appointments": appointment
            })
        } catch (e) {
            res.status(500);
            res.json({
                "error": e.message
            })
        }
    })


    // DELETE
    app.delete('/api/appointment/:id', async (req, res) => {
        try {
            const result = await db.collection('appointments').deleteOne({
                "_id": new ObjectId(req.params.id)
            });

            if (result.deletedCount == 0) {
                res.status(400);
                res.json({
                    "error": "Appointment not found"
                });
                return;
            }

            res.json({
                "message": "Appointment deleted successfully"
            })
        } catch (e) {
            res.status(500);
            res.json({
                "error": e.message
            })
        }
    })


    // USERS
    app.post('/user', async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 12);
            const result = db.collection("user").insertOne({
                "email": req.body.email,
                "password": hashedPassword
            });
            res.json({
                result
            })
        } catch (e) {
            res.status(500);
            res.json({
                "error": e.message
            })
        }
    })

    // LOGIN
    app.post('/login', async (req, res) => {
        try {
            const user = await db.collection('user').findOne({
                "email": req.body.email
            })

            if (user){
                if (await bcrypt.compare(req.body.password, user.password)){
                    const token = generateAccessToken(user._id, user.email);
                    res.json({
                        'token': token
                    })
                } else {
                    res.res(400);
                    res.json({
                        "error": "Invalid login credentials"
                    })
                }
            } else {
                res.res(400);
                res.json({
                    "error": "Invalid login credentials"
                })
            }
        } catch (e) {
            res.status(500);
            res.json({
                "error": e.message
            })
        }
    })

    app.get('/profile', authenticateWithJWT, async (req, res) => {
        try {
            res.json({
                "message": "Success in accessing protected route",
                'payload': req.payload
            })
        } catch (e) {
            res.status(500);
            res.json({
                "error": e.message
            })
        }
    });
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