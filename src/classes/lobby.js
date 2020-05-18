const MADN =  require('./madn');

module.exports = class Lobby {
    constructor (io, radio) {
        this.io = io;
        this.radio = radio;

        this.playersInLobby = 0;
        this.game = null;
        this.playerSockets = []

        this.onInit();
    }

    onInit () {
        this.io.on('connection', (socket) => {
            this.addPlayer(socket);
        
            socket.on('disconnect', () => {
                if (socket.player) {
                    this.game.destroyPlayer(socket.player);
                }
                this.removePlayer();
            }, this)
        
            socket.on('playerName', (name) => {
                if (this.game) {
                    socket.player = this.game.createNewPlayer(name, socket);
                }
            }, this);
        
            socket.on('playerState', (state) => {
                if (socket.player) {
                    socket.player.setReady(state);
                    console.log(this.game);
                }
            }, this);

            socket.on('chooseAvatar', (avatar) => {
                socket.player.setAvatar(avatar);
            });

        }, this);

        // reset client on server restart
        setTimeout(() => {
            this.io.emit('serverStarted');
        }, 1000);
    }

    addPlayer (socket) {
        this.playersInLobby += 1;
    
        console.log('player connected, PlayerCount: ' + this.playersInLobby);
    
        if (this.playersInLobby === 1 && this.game === null) {
            this.game = new MADN(this.io, this.radio);
            console.log('new Session started');
        }
    }
    
    removePlayer () {
        this.playersInLobby -= 1;
        console.log('player disconnected, PlayerCount: ' + this.playersInLobby);
    
        if (this.playersInLobby === 0) {
            console.log('end game session');
            this.game = null;
        }
    }
}