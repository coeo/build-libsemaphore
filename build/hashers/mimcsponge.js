"use strict";
exports.__esModule = true;
var circomlib = require("circomlib");
var snarkjs = require("snarkjs");
var mimcsponge = circomlib.mimcsponge;
var bigInt = snarkjs.bigInt;
var MimcSpongeHasher = /** @class */ (function () {
    function MimcSpongeHasher() {
    }
    MimcSpongeHasher.prototype.hash = function (_, left, right) {
        return mimcsponge.multiHash([bigInt(left), bigInt(right)]).toString();
    };
    return MimcSpongeHasher;
}());
exports["default"] = MimcSpongeHasher;
//# sourceMappingURL=mimcsponge.js.map