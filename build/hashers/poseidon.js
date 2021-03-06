"use strict";
exports.__esModule = true;
var circomlib = require("circomlib");
var snarkjs = require("snarkjs");
var poseidon = circomlib.poseidon;
var bigInt = snarkjs.bigInt;
var PoseidonHasher = /** @class */ (function () {
    function PoseidonHasher() {
        this.hashFunc = poseidon.createHash(3, 8, 57, 'poseidon');
    }
    PoseidonHasher.prototype.hash = function (_, left, right) {
        return this.hashFunc([left, right]);
    };
    return PoseidonHasher;
}());
exports["default"] = PoseidonHasher;
//# sourceMappingURL=poseidon.js.map