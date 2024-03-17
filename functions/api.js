const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

let records = [];


router.get('/', (req, res) => {
    res.send("App is Running..");
});

router.post('/add', (req, res) => {
    res.send("New Record is added.");
});

router.delete('/:id', (req, res) => {
    res.send("Deleted the record..");
})

router.put('/:id', (req, res) => {
    res.send("Updated the existing record");
})

router.get('/demo', (req, res) => {
    res.json([
        {
            "id": '101',
            "name": "Allen",
            "email": "allen@gmail.com",
            "mob": "8799123455"
        },
        {
            "id": '102',
            "name": "Branden",
            "email": "brande@gmail.com",
            "mob": "87991234667"
        },
        {
            "id": '103',
            "name": "Smith",
            "email": "smith@gmail.com",
            "mob": "87991234509"
        },
        {
            "id": '104',
            "name": "zen",
            "email": "zen@gmail.com",
            "mob": "87991234512"
        },
    ]);

    app.use('/.netlify/functions/api', router);
    module.exports.handler = serverless(app);
})