async function initGame() {
    await Lobby();
    await Game();

    new Vue({
        el: "#app",
        data: () => ({
            gameStarted: true,
            socket: io('/', {
                query: {
                    type: "fe-user",
                }
            }),
            allPlayers: []
        }),
        created() {
            this.listen();
            // reload on server reset
            this.socket.on('serverStarted', () => {
                console.log('server restarted');
                window.location.reload();
            });
        },
        methods: {
            listen() {
                this.socket.on('allPlayers', this.updatePlayers);
                this.socket.on('notify', this.notify);
            },
            updatePlayers(players) {
                console.log(players);
                this.allPlayers = players;
            },
            notify(msg) {
                alert(msg); 
            },
            startGame() {
                console.log("game started");
                this.gameStarted = true;
            }
        }
    });
}

const app =  initGame();
