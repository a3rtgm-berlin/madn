const Board = require('./board');
const Player = require('./player');

module.exports = class MADN {
    constructor (io, radio) {
        this.io = io;
        this.radio = radio;

        this.title = "Mänschn ørger dytschn nytschn!";
        this.players = [];
        this.playerNumber = 0;
        this.playersReady = 0;
        this.allPlayersReady = false;

        console.log(this.title);

        this.initialize();
    }

    initialize () {
        this.radio.on('playerReady', (state) => {
            if (state) {
                this.playersReady += 1;

                if (this.playersReady === this.players.length) {
                    if (this.players.length > 1) {
                        this.allPlayersReady = true;
                        this.io.emit('allPlayersReady', true);
                        this.countDown();
                    }
                    else {
                        this.io.emit('notify', 'Da bynst sonst kyner am Steysen am bynsen, Aldør!');
                    }
                }
            } 
            else {
                this.playersReady -= 1;

                if (this.allPlayersReady) {
                    this.allPlayersReady = false;
                    this.io.emit('allPlayersReady', false);
                }

                if (this.counter) {
                    clearInterval(this.counter);
                    this.io.emit('cancelGameStart');
                }
            }

            this.emitPlayers()
        });

        this.radio.on('playerChanged', this.emitPlayers.bind(this));
    }

    createNewPlayer (name, socket) {
        if (this.players.find(player => player.get('name') === name)) {
            this.io.to(socket.id).emit('playerExists', true);
            return null;
        }

        console.log("player created");
        const player = new Player(name, this.io, this.radio);

        this.players.push(player);
        this.playerNumber += 1;

        console.log(socket.id);
        this.io.to(socket.id).emit('playerExists', false);
        this.emitPlayers()
        return player;
    }

    destroyPlayer (player) {
        this.players = this.players.filter(_player => _player.attrs.name !== player.attrs.name);
        this.playerNumber -= 1;

        this.emitPlayers()
    }

    countDown () {
        let countdown = 3;
        this.counter = setInterval(() => {
            countdown -= 1;
            console.log(countdown);

            if (countdown < 0) {
                clearInterval(this.counter);
                this.createNewGame();
            }
        }, 1000);
    }

    createNewGame () {
        if (this.playersReady === this.players.length) {
            this.radio.emit('gameStarted');
            this.board = new Board(this.playerNumber);
            this.players.forEach((player, i) => {
                player.set({
                    'start': i * 10,
                    'exit': i + this.board.fields.length > this.board.fields.length ? (i * 10) - 1 : i + this.board.fields.length - 1
                });
            });

            this.updateGame();
            this.emitPlayers()
            console.log(this.board);
        }
    }

    updateGame () {
        this.io.emit('gameState', this.board);
    }

    emitPlayers () {
        this.io.emit('allPlayers', this.players.map(player => player.attrs));
        console.log(this.players);
    }
}