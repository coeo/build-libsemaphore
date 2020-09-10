"use strict";
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
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var path = require('path');
var uuidv4 = require('uuid/v4');
var fs = require("fs");
var ethers = require("ethers");
jest.setTimeout(30000);
var assert = chai.assert;
var libsemaphore = require("../index");
var circuitPath = path.join(__dirname, '/../../semaphore/semaphorejs/build/circuit.json');
var provingKeyPath = path.join(__dirname, '/../../semaphore/semaphorejs/build/proving_key.bin');
var verifyingKeyPath = path.join(__dirname, '/../../semaphore/semaphorejs/build/verification_key.json');
var cirDef = JSON.parse(fs.readFileSync(circuitPath).toString());
var provingKey = fs.readFileSync(provingKeyPath);
var verifyingKey = libsemaphore.parseVerifyingKeyJson(fs.readFileSync(verifyingKeyPath).toString());
var externalNullifier = '0';
describe('libsemaphore', function () {
    var _this = this;
    var identity = libsemaphore.genIdentity();
    var witness;
    var witnessData;
    var circuit;
    var proof;
    var publicSignals;
    it('genIdentity() should produce values of the correct length and type', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            assert.equal(identity.keypair.pubKey.length, 2);
            assert.equal(identity.keypair.privKey.length, 32);
            assert.equal(typeof identity.identityNullifier, 'bigint');
            assert.equal(typeof identity.identityTrapdoor, 'bigint');
            return [2 /*return*/];
        });
    }); });
    it('serialiseIdentity() and unSerialiseIdentity() should work', function () { return __awaiter(_this, void 0, void 0, function () {
        var serialisedId, unSerialisedId;
        return __generator(this, function (_a) {
            serialisedId = libsemaphore.serialiseIdentity(identity);
            unSerialisedId = libsemaphore.unSerialiseIdentity(serialisedId);
            expect(unSerialisedId).toEqual(identity);
            expect(unSerialisedId.identityNullifier).toEqual(identity.identityNullifier);
            expect(unSerialisedId.identityTrapdoor).toEqual(identity.identityTrapdoor);
            expect(unSerialisedId.keypair.privKey.toString('hex')).toEqual(identity.keypair.privKey.toString('hex'));
            expect(unSerialisedId.keypair.pubKey).toEqual(identity.keypair.pubKey);
            return [2 /*return*/];
        });
    }); });
    it('identityCommitment() should produce a value of the correct length and type', function () { return __awaiter(_this, void 0, void 0, function () {
        var idc;
        return __generator(this, function (_a) {
            idc = libsemaphore.genIdentityCommitment(identity);
            assert.equal(typeof idc, 'bigint');
            assert.isBelow(idc.toString(16).length, 65);
            // This may fail in very rare occasions; just run the test again
            assert.isAbove(idc.toString(16).length, 48);
            return [2 /*return*/];
        });
    }); });
    it('genMixerSignal should return a hash', function () { return __awaiter(_this, void 0, void 0, function () {
        var signal;
        return __generator(this, function (_a) {
            signal = libsemaphore.genMixerSignal('0xabcd', '0xdefd', 0);
            expect(signal).toHaveLength(66);
            expect(signal.slice(0, 2)).toEqual('0x');
            return [2 /*return*/];
        });
    }); });
    it('genWitness() should generate a witness', function () { return __awaiter(_this, void 0, void 0, function () {
        var idc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    idc = libsemaphore.genIdentityCommitment(identity);
                    circuit = libsemaphore.genCircuit(cirDef);
                    return [4 /*yield*/, libsemaphore.genWitness('signal0', circuit, identity, [new ethers.utils.BigNumber(idc.toString())], 4, externalNullifier)];
                case 1:
                    witnessData = _a.sent();
                    witness = witnessData.witness;
                    expect(circuit.checkWitness(witness)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('genProof() should generate a valid proof', function () { return __awaiter(_this, void 0, void 0, function () {
        var isValid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, libsemaphore.genProof(witness, provingKey)];
                case 1:
                    proof = _a.sent();
                    publicSignals = libsemaphore.genPublicSignals(witness, circuit);
                    isValid = libsemaphore.verifyProof(verifyingKey, proof, publicSignals);
                    return [2 /*return*/];
            }
        });
    }); });
    it('formatForVerifierContract() should produce the correct params', function () { return __awaiter(_this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            params = libsemaphore.formatForVerifierContract(proof, publicSignals);
            expect(params.input).toHaveLength(publicSignals.length);
            expect(params.a).toHaveLength(2);
            expect(params.b).toHaveLength(2);
            expect(params.b[0]).toHaveLength(2);
            expect(params.b[1]).toHaveLength(2);
            expect(params.c).toHaveLength(2);
            return [2 /*return*/];
        });
    }); });
    it('genBroadcastSignalParams() should produce the correct params', function () { return __awaiter(_this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            params = libsemaphore.genBroadcastSignalParams(witnessData, proof, publicSignals);
            expect(params).toHaveProperty('signal');
            expect(params.proof).toHaveLength(8);
            expect(params).toHaveProperty('root');
            expect(params).toHaveProperty('nullifiersHash');
            expect(params).toHaveProperty('externalNullifier');
            return [2 /*return*/];
        });
    }); });
    test('genExternalNullifier() should always return a 32-byte hex string whose true size is 29 bytes', function () {
        var plaintext = 'test question';
        var fullHash = ethers.utils.solidityKeccak256(['string'], [plaintext]);
        var hash = libsemaphore.genExternalNullifier(plaintext);
        expect(fullHash)
            .toEqual('0x51480a3453be7db7a786adbfc5d579a36a620c26f5a2e51d4c296d52892e38d6');
        expect(hash)
            .toEqual('0x0000003453be7db7a786adbfc5d579a36a620c26f5a2e51d4c296d52892e38d6');
        expect(hash).toHaveLength(66);
    });
});
//# sourceMappingURL=libsemaphore.test.js.map