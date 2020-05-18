module.exports = class Token {
    constructor () {
        this.position = null;
        this.nextPosition = this.position + 1;
        this.lastPosition = this.position - 1;
        this.finalPosition = null;
        this.inHouse = true;
        this.inSafeZone = false;
    }
}