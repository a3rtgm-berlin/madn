const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const socketIO = require('socket.io');
const EventEmitter = require('events');

// Classes
const MADN = require('./src/classes/madn'); 
const Board = require('./src/classes/board');
const Player = require('./src/classes/player');
const Lobby = require('./src/classes/lobby');

const port = process.env.PORT || 3000;

// base const
const app =  express();
const server = http.createServer(app);
const io = socketIO(server);
const radio = new EventEmitter();
const lobby = new Lobby(io, radio);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded(true));
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
});

server.listen(port, () => {
    console.log('listening on *3000');
});