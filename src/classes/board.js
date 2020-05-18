const Field = require('./field');

module.exports = class Board {
    constructor (playerCount) {
        this.fields = new Array(playerCount * 10);
        
        for (let i = 0; i < playerCount * 10; i++) {
            this.fields[i] = new Field();
        }

        for (let i = 0; i < playerCount; i++) {
            const field = (i * 10) + 4;

            if (playerCount % 2 !== 0) {
                const linkedField = field + 20;

                this.fields[field].link = linkedField > this.fields.length ? linkedField - this.fields.length : linkedField;
            }
            else {
                const linkedField = field + (this.fields.length / 2);

                this.fields[field].link = linkedField > this.fields.length ? linkedField - this.fields.length : linkedField;
            }
        }
    }
}

