//Import NPM Packages
const express = require('express');
const fs = require('fs');

//Import Config
const config = require('./config.js');

//Init Express
const app = express();
const port = config.port;

const http = require('http').Server(app);

//Init Websocket
const wsport = config.WSport;

const WebSocket = require('ws');

const wss = new WebSocket.Server({port: wsport});


console.log('[INFO]\tWebsocket has opened on port ' + wsport + '.');

wss.on('connection', function connection(ws) {
    console.log("[INFO]\tClient connected.");
    ws.on('close', () => {
        console.log('[INFO]\tClient disconnected.')
    });
});

//Get Auth Info 
const keys = config.keys;

//Import Sendou.ink
const sendou = require('./sendou.js');

//Function to save data to .json file
const saveData = async (data) => {
    if (data && data.currentMatch && data.currentMatch.teamA && data.currentMatch.teamB) {
        data['sink'] = {};
        data['sink']['teamA'] = await sendou.getFullDataFromTeam(data.currentMatch.teamA);
        data['sink']['teamB'] = await sendou.getFullDataFromTeam(data.currentMatch.teamB);
    }
    
    data = JSON.stringify(data, null, 2);
    
    fs.writeFileSync('./data/data.json', data);

    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    })
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

http.listen(port, () => {
    console.log("[INFO]\tInfo Middleman service has been started on port " + port + ".");
});