"use strict";
exports.__esModule = true;
var circomlib = require("circomlib");
var snarkjs = require("snarkjs");
var mimc7 = circomlib.mimc7;
var bigInt = snarkjs.bigInt;
var Mimc7Hasher = /** @class */ (function () {
    function Mimc7Hasher() {
    }
    Mimc7Hasher.prototype.hash = function (_, left, right) {
        return mimc7.multiHash([bigInt(left), bigInt(right)]).toString();
    };
    return Mimc7Hasher;
}());
exports["default"] = Mimc7Hasher;
//# sourceMappingURL=mimc7.js.map