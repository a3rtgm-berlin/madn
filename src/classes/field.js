module.exports = class Field {
    constructor (type) {
        this.type = type || 'normal';
        this.player = null;
        this.event = null;
        this.link = null;
    }
}