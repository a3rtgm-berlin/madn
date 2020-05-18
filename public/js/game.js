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
                    tokens: []
                }),
                computed: {
                    canvas() {
                        return this.$refs?.board;
                    },
                    ctx() {
                        return this.board?.getContext("2d")
                    }
                },
                created() {
                    this.listen();
                },
                mounted() {
                    this.canvas.width = window.innerWidth;
                    this.canvas.height = window.height;

                    this.startInterval()
                },
                watch: {
                    board() {
                        console.log(this.board);
                    }
                },
                methods: {
                    startGame() {
                        tokens.push(new Token(30, 30, "red", 10, 120, this.ctx));
                    },
                    listen() {
                        this.socket.on('gameState', this.updateBoard);
                    },
                    startInterval() {
                        this.interval = setInterval(this.updateBoard, 20);
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
        this.ctx = ctx;
    }

    update() {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};