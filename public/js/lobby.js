const Lobby = () => {
    return fetchTemplate("lobby")
        .then((template) => {
            Vue.component('Lobby', {
                props: {
                    socket: {
                        required: true,
                        defaults: null
                    },
                    gameStarted: {
                        defaults: false
                    },
                    allPlayers: {
                        defaults: []
                    }
                },
                data: () => ({
                    title: "",
                    playerName: "",
                    playerState: false,
                    playerRegistered: false,
                    playerAvatar: null,
                    avatars: [],
                    countdownText: null
                }),
                computed: {
                    registeredPlayerAvatars() {
                        return this.allPlayers.map(p => p.avatar);
                    },
                },
                watch: {
                    playerState(state) {
                        this.socket.emit('playerState', state);
                    },
                    playerAvatar(avatar) {
                        this.socket.emit('chooseAvatar', avatar);
                    },
                    registeredPlayerAvatars() {
                        console.log(this.registeredPlayerAvatars);
                    }
                },
                created () {
                    this.listen();
                    this.fetchGameData();
                },
                methods: {
                    listen() {
                        this.socket.on('allPlayersReady', this.countdown);
                        this.socket.on('playerExists', this.createPlayer);
                    },
                    fetchGameData() {
                        fetch('../assets/avatars.json')
                            .then((res) => {
                                return res.json();
                            })
                            .then((data) => {
                                this.avatars = data;
                                console.log(this.avatars);
                            });
                    },
                    checkIn() {
                        if (!this.playerName) {
                            return alert('Enter ma n koreytschn Name, Aldør!');
                        }
                        console.log('playerName entered: ' + this.playerName);        
                        this.socket.emit('playerName', this.playerName);
                    },
                    createPlayer(playerExists) {
                        console.log("Player registered");
                        if (!playerExists) {
                            this.playerRegistered = true;
                        }
                        else {
                            alert('der Name bynst schon am existen, Aldør!');
                        }
                    },
                    chooseAvatarClass(avatar, name) {
                        return {
                            selected: this.playerAvatar === name, 
                            [avatar.color[0]]: true, 
                            disabled: this.registeredPlayerAvatars.includes(name) && name !== this.playerAvatar
                        }
                    },
                    chooseAvatarStyle(avatar, name) {
                        if (this.registeredPlayerAvatars.includes(name) && name !== this.playerAvatar) {
                            return {
                                outline: `3px dotted ${avatar.color[1]}`,
                                'outline-offset': '4px'
                            };
                        }
                        return {};
                    },
                    countdown() {
                        let countdown = 3;
                        this.countdownText = countdown;
                        
                        const counter = setInterval(() => {
                            countdown -= 1;
                    
                            if (countdown < 0) {
                                clearInterval(counter);
                                this.countdownText = 'FIGHT!';
                                setTimeout(() => {
                                    this.countdownText = null;
                                    this.startGame();
                                }, 1000);
                            }
                            else {
                                this.countdownText = countdown;
                            }
                        }, 1000);
                    
                        this.socket.on('cancelGameStart', () => {
                            clearInterval(counter);
                            this.countdownText = null;
                        })
                    },
                    startGame() {
                        this.$emit("start-game");
                    }
                },
                template: template
            });
        });
};
