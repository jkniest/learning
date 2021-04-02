import './style.css'
import "./src/Manager";

Array.prototype.shuffle = function () {
    let j, x, i;
    for (i = this.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = this[i];
        this[i] = this[j];
        this[j] = x;
    }

    return this;
};

declare global {
    interface Array<T> {
        shuffle(): any;
    }
}
