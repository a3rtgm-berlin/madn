const Field = require('./field');

module.exports = class House {
    constructor (player) {
        this.fields = new Array(4);
        this.fields.fill().map(field => new Field('house'));
    }
}