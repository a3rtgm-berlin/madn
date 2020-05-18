const Game = () => {
    return fetchTemplate("game")
        .then((template) => {
            Vue.component("Game", {
                props: {
                    socket: {
                        required: true,
                        defaults: null
                    }
                },
                data: () => ({
                    board: null,
                    interval: null,
                    tokens: [],
                    vel: [0,0],
                    tar: {
                        x: 10,
                        y: 120
                    },
                    velocity: 1
                }),
                computed: {
                    canvas() {
                        return this.$refs?.board;
                    },
                    ctx() {
                        return this.canvas?.getContext("2d")
                    }
                },
                created() {
                    this.listen();
                },
                mounted() {
                    this.canvas.width = window.innerWidth * 0.8;
                    this.canvas.height = window.innerHeight * 0.6;
                    this.startInterval();

                    this.startGame();
                },
                watch: {
                    board() {
                        console.log(this.board);
                    }
                },
                methods: {
                    startGame() {
                        this.tokens.push(new Token(30, 30, "red", 10, 120, this.ctx));
                    },
                    listen() {
                        this.socket.on('gameState', this.updateBoard);

                        // window.addEventListener("keydown", (evt) => {
                        //     console.log(evt.code);
                        //     switch(evt.code) {
                        //         case "ArrowUp": 
                        //             this.vel[1] = -2;
                        //             break;
                        //         case "ArrowDown": 
                        //             this.vel[1] = 2;
                        //             break;
                        //         case "ArrowLeft": 
                        //             this.vel[0] = -2;
                        //             break;
                        //         case "ArrowRight": 
                        //             this.vel[0] = 2;
                        //             break;
                        //     }
                        //     console.log(this.vel);
                        // });
                        // window.addEventListener("keyup", (evt) => {
                        //     switch(evt.code) {
                        //         case "ArrowUp": 
                        //             this.vel[1] = 0;
                        //             break;
                        //         case "ArrowDown": 
                        //             this.vel[1] = 0;
                        //             break;
                        //         case "ArrowLeft": 
                        //             this.vel[0] = 0;
                        //             break;
                        //         case "ArrowRight": 
                        //             this.vel[0] = 0;
                        //             break;
                        //     }
                        // });
                    },
                    startInterval() {
                        this.interval = setInterval(this.updateCanvas, 20);
                    },
                    clearInterval() {
                        clearInterval(this.interval);
                    },
                    updateBoard(board) {
                        this.board = board;
                    },
                    clearCanvas() {
                        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    },
                    updateCanvas() {
                        this.clearCanvas();
                        this.tokens.forEach(t => {
                            const V = this.getV(t.x, t.y, this.tar, this.velocity);
                            t.y += V.y;
                            t.x += V.x;
                        });
                        this.tokens.forEach(t => t.update());
                    },
                    getV(posX, posY, tar, vel = 1) {
                        const dx = tar.x - posX,
                            dy = tar.y - posY,
                            v = (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))) / vel;
                        
                        return {
                            x: dx / v || 0,
                            y: dy / v || 0
                        };
                        
                    }
                },
                template: template
            });
        })
}

class Token {
    constructor(width, height, color, x, y, ctx) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.ctx = ctx;
    }

    update() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};