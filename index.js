//Import NPM Packages
const express = require('express');

//Import Config
const config = require('./config.js');

//Init Express
const app = express();
const port = config.port;

//Get Auth Info 
const keys = config.keys;

app.use(express.json());
app.post('/update/:auth', (req, res) => {
    let auth = req.params.auth;

    if (auth && keys.includes(auth)) {
        if (!req.body) return res.sendStatus(400);
        console.log("[INFO]\tRequest from NodeCG was acknowledged and recorded.");

    }
    else {
        console.warn("[WARN]\tA request was forbidden.")
        return res.sendStatus(403);
    }
});

app.listen(port);
console.log("[INFO]\tInfo Middleman service has been started on port " + port + ".");