const Field = require('./field');

module.exports = class Board {
    constructor (playerCount) {
        
        if(playerCount <= 3) {
        this.fields = new Array(playerCount * 12);
        fixFields = 12;
        } else if (playerCount > 3 && playercount < 6 ) {
            this.fields = new Array(playerCount * 10);
            fixFields = 10;
        } else if (playerCount >= 6){    
            this.fields = new Array(playerCount * 8);
            fixFields = 8;
        }


        for (let i = 0; i < playerCount * fixFields; i++) {
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

