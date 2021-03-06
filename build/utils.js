"use strict";
// Copied from semaphore/semaphorejs/src/util/index.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.beBuff2int = exports.cutDownBits = exports.prove = exports.convertWitness = void 0;
var snarkjs = require("snarkjs");
var assert = require("assert");
var bigInt = require('big-integer');
var unstringifyBigInts = function (o) {
    if ((typeof (o) == "string") && (/^[0-9]+$/.test(o))) {
        return bigInt(o);
    }
    else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    }
    else if (typeof o == "object") {
        var res = {};
        for (var k in o) {
            res[k] = unstringifyBigInts(o[k]);
        }
        return res;
    }
    else {
        return o;
    }
};
var writeUint32 = function (h, val) {
    h.dataView.setUint32(h.offset, val, true);
    h.offset += 4;
};
var writeBigInt = function (h, bi) {
    for (var i = 0; i < 8; i++) {
        var v = bi.shiftRight(i * 32).and(0xFFFFFFFF).toJSNumber();
        writeUint32(h, v);
    }
};
var calculateBuffLen = function (witness) {
    var size = 0;
    // beta2, delta2
    size += witness.length * 32;
    return size;
};
var convertWitness = function (witnessJson) {
    var witness = unstringifyBigInts(witnessJson);
    var buffLen = calculateBuffLen(witness);
    var buff = new ArrayBuffer(buffLen);
    var h = {
        dataView: new DataView(buff),
        offset: 0
    };
    for (var i = 0; i < witness.length; i++) {
        writeBigInt(h, witness[i]);
    }
    assert.equal(h.offset, buffLen);
    return Buffer.from(buff);
};
exports.convertWitness = convertWitness;
var buildGroth16 = require('websnark/src/bn128.js');
var prove = function (witness, provingKey) { return __awaiter(void 0, void 0, void 0, function () {
    var groth16, p;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, buildGroth16()];
            case 1:
                groth16 = _a.sent();
                return [4 /*yield*/, groth16.groth16GenProof(witness, provingKey)];
            case 2:
                p = _a.sent();
                //groth16.terminate()
                return [2 /*return*/, snarkjs.unstringifyBigInts(p)];
        }
    });
}); };
exports.prove = prove;
var cutDownBits = function (b, bits) {
    var mask = snarkjs.bigInt(1);
    mask = mask.shl(bits).sub(snarkjs.bigInt(1));
    return b.and(mask);
};
exports.cutDownBits = cutDownBits;
var beBuff2int = function (buff) {
    var res = snarkjs.bigInt.zero;
    for (var i = 0; i < buff.length; i++) {
        var n = snarkjs.bigInt(buff[buff.length - i - 1]);
        res = res.add(n.shl(i * 8));
    }
    return res;
};
exports.beBuff2int = beBuff2int;
//# sourceMappingURL=utils.js.map