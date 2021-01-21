//Import NPM Packages
const express = require('express');
const fs = require('fs');
const { Server } = require('http');

//Import Config
const config = require('./config.js');

//Init Express
const app = express();
const port = config.port;

//Init Websocket
const wsport = config.WSport;

const wserver = require('http').createServer();
const io = require('socket.io')(wserver);

wserver.listen(wsport, function() {
    console.log("[INFO]\tWebsocket server started on " + wsport + ".");
})

io.on('connection', socket => {
    console.log('[INFO]\tNew WS client connected.')
})



//Get Auth Info 
const keys = config.keys;

//Function to save data to .json file
const saveData = function(data) {
    io.emit('update', data);
    data = JSON.stringify(data, null, 2);
    fs.writeFileSync('./data/data.json', data);
};

//Webserver
app.use(express.json());
app.post('/update/:auth', (req, res) => {
    let auth = req.params.auth;

    if (auth && keys.includes(auth)) {
        if (!req.body) return res.sendStatus(400);
        console.log("[INFO]\tRequest from NodeCG was acknowledged and recorded.");
        res.sendStatus(200);
        
        saveData(req.body);

    }

    else {
        console.warn("[WARN]\tA request was forbidden.")
        return res.sendStatus(403);
    }
});

app.get('/data', (req, res) => {
    res.type('json');
    res.send(fs.readFileSync('./data/data.json'));
});

app.use(express.static('public'));

app.listen(port);
console.log("[INFO]\tInfo Middleman service has been started on port " + port + ".");