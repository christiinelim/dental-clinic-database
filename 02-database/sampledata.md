# Sample Data for Treatments
```
db.treatments.insertMany([
    {
        "treatment": "scaling",
        "amount": 500
    },
    {
        "treatment": "polishing",
        "amount": 90
    },
    {
        "treatment": "extraction",
        "amount": 1000
    }
])
```

# Sample Data for Patients
```
db.patients.insertMany([
    {
        "name": "Anna",
        "dob": "2001-01-01",
        "gender": "female",
        "address": {
            "streetName": "Yishun Ring Road",
            "blockNumber": "666",
            "unitNumber": "10-01",
            "postalCode": "760666"
        }
    },
    {
        "name": "Jason",
        "dob": "1986-08-31",
        "gender": "male",
        "address": {
            "streetName": "Ang Mo Kio Ave 2",
            "blockNumber": "476",
            "unitNumber": "10-01",
            "postalCode": "560476"
        }
    },
    {
        "name": "Paul",
        "dob": "1997-04-01",
        "gender": "male",
        "address": {
            "streetName": "Tampines East Ave 10",
            "blockNumber": "111",
            "unitNumber": "10-01",
            "postalCode": "470111"
        }
    }
])
```

# Sample Data for Dentists
```
db.dentists.insertMany([
    {
        "name": " Dr John Lim",
        "registrationNumber": "D21234",
        "dob": "1980-01-01",
        "licenseExpiryDate": "2024-12-31",
        "gender": "male",
        "patientId": [],
        "appointmentId": []
    },
    {
        "name": "Dr David Tan",
        "registrationNumber": "D21235",
        "dob": "1979-01-01",
        "licenseExpiryDate": "2024-12-31",
        "gender": "male",
        "patientId": [],
        "appointmentId": []
    },
    {
        "name": "Dr Jasmine Chew",
        "registrationNumber": "D21236",
        "dob": "1978-01-01",
        "licenseExpiryDate": "2024-12-31",
        "gender": "female",
        "patientId": [],
        "appointmentId": []
    }
])
```