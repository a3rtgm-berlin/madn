const House = require('./house');
const Token = require('./token');

module.exports = class Player {
    constructor (name, io, radio) {
        this.io = io;
        this.radio = radio;
        this.attrs = {};

        this.set({
            'ready': false,
            'name': name,
            'house': new House(),
            'tokens': new Array(4).fill().map(token => new Token()),
            'start': null,
            'exit': null,
            'avatar': ''
        });

        console.log(this.get('name'));
    }

    setAvatar (avatar) {
        this.set('avatar', avatar);
        this.radio.emit('playerChanged');
    }

    setReady (state) {
        this.set('ready', state);
        this.radio.emit('playerReady', state);
    }

    get (attr) {
        return this.attrs[attr];
    }

    set (attrOrObj, val) {
        if (typeof attrOrObj === "string" && val) {
            this.attrs[attrOrObj] = val;
        }
        else if (typeof attrOrObj === "object" && !val) {
            for (const key in attrOrObj) {
                this.attrs[key] = attrOrObj[key];
            }
        }
    }
}