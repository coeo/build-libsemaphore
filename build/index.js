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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.genSignalHash = exports.genBroadcastSignalParams = exports.genExternalNullifier = exports.unSerialiseIdentity = exports.serialiseIdentity = exports.unstringifyBigInts = exports.stringifyBigInts = exports.formatForVerifierContract = exports.genIdentityCommitment = exports.signMsg = exports.verifySignature = exports.verifyProof = exports.genTree = exports.genCircuit = exports.genSignedMsg = exports.genPublicSignals = exports.genProof = exports.genMixerWitness = exports.genMixerSignal = exports.genWitness = exports.genIdentity = exports.genPubKey = exports.setupTree = exports.parseVerifyingKeyJson = void 0;
var snarkjs = require("snarkjs");
var circomlib = require("circomlib");
var crypto = require("crypto");
var ethers = require("ethers");
var utils_1 = require("./utils");
var semaphore_merkle_tree_1 = require("semaphore-merkle-tree");
var MemStorage = semaphore_merkle_tree_1.storage.MemStorage;
var MerkleTree = semaphore_merkle_tree_1.tree.MerkleTree;
var MimcSpongeHasher = semaphore_merkle_tree_1.hashers.MimcSpongeHasher;
var stringifyBigInts = snarkjs.stringifyBigInts;
exports.stringifyBigInts = stringifyBigInts;
var unstringifyBigInts = snarkjs.unstringifyBigInts;
exports.unstringifyBigInts = unstringifyBigInts;
var pedersenHash = function (ints) {
    var p = circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(Buffer.concat(ints.map(function (x) { return x.leInt2Buff(32); }))));
    return snarkjs.bigInt(p[0]);
};
var genRandomBuffer = function (numBytes) {
    if (numBytes === void 0) { numBytes = 32; }
    return crypto.randomBytes(numBytes);
};
var genPubKey = function (privKey) {
    var pubKey = circomlib.eddsa.prv2pub(privKey);
    return pubKey;
};
exports.genPubKey = genPubKey;
var genEddsaKeyPair = function (privKey) {
    if (privKey === void 0) { privKey = genRandomBuffer(); }
    var pubKey = genPubKey(privKey);
    return { pubKey: pubKey, privKey: privKey };
};
var genIdentity = function (privKey) {
    if (privKey === void 0) { privKey = genRandomBuffer(32); }
    // The identity nullifier and identity trapdoor are separate random 31-byte
    // values
    return {
        keypair: genEddsaKeyPair(privKey),
        identityNullifier: snarkjs.bigInt.leBuff2int(genRandomBuffer(31)),
        identityTrapdoor: snarkjs.bigInt.leBuff2int(genRandomBuffer(31))
    };
};
exports.genIdentity = genIdentity;
var serializeIdentity = function (identity) {
    var data = [
        identity.keypair.privKey.toString('hex'),
        identity.identityNullifier.toString(16),
        identity.identityTrapdoor.toString(16),
    ];
    return JSON.stringify(data);
};
var unSerializeIdentity = function (serialisedIdentity) {
    var data = JSON.parse(serialisedIdentity);
    return {
        keypair: genEddsaKeyPair(Buffer.from(data[0], 'hex')),
        identityNullifier: snarkjs.bigInt('0x' + data[1]),
        identityTrapdoor: snarkjs.bigInt('0x' + data[2])
    };
};
var serialiseIdentity = serializeIdentity;
exports.serialiseIdentity = serialiseIdentity;
var unSerialiseIdentity = unSerializeIdentity;
exports.unSerialiseIdentity = unSerialiseIdentity;
var genIdentityCommitment = function (identity) {
    return pedersenHash([
        circomlib.babyJub.mulPointEscalar(identity.keypair.pubKey, 8)[0],
        identity.identityNullifier,
        identity.identityTrapdoor,
    ]);
};
exports.genIdentityCommitment = genIdentityCommitment;
var signMsg = function (privKey, msg) {
    return circomlib.eddsa.signMiMCSponge(privKey, msg);
};
exports.signMsg = signMsg;
var genSignedMsg = function (privKey, externalNullifier, signalHash) {
    var msg = circomlib.mimcsponge.multiHash([
        externalNullifier,
        signalHash,
    ]);
    return {
        msg: msg,
        signature: signMsg(privKey, msg)
    };
};
exports.genSignedMsg = genSignedMsg;
var genPathElementsAndIndex = function (tree, identityCommitment) { return __awaiter(void 0, void 0, void 0, function () {
    var leafIndex, identityPath, identityPathElements, identityPathIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tree.element_index(identityCommitment)];
            case 1:
                leafIndex = _a.sent();
                return [4 /*yield*/, tree.path(leafIndex)];
            case 2:
                identityPath = _a.sent();
                identityPathElements = identityPath.path_elements;
                identityPathIndex = identityPath.path_index;
                return [2 /*return*/, { identityPathElements: identityPathElements, identityPathIndex: identityPathIndex }];
        }
    });
}); };
var verifySignature = function (msg, signature, pubKey) {
    return circomlib.eddsa.verifyMiMCSponge(msg, signature, pubKey);
};
exports.verifySignature = verifySignature;
var genTree = function (treeDepth, leaves) { return __awaiter(void 0, void 0, void 0, function () {
    var tree, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tree = setupTree(treeDepth);
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < leaves.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, tree.update(i, leaves[i].toString())];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, tree];
        }
    });
}); };
exports.genTree = genTree;
var genMixerSignal = function (recipientAddress, forwarderAddress, feeAmt) {
    return ethers.utils.solidityKeccak256(['address', 'address', 'uint256'], [recipientAddress, forwarderAddress, feeAmt.toString()]);
};
exports.genMixerSignal = genMixerSignal;
var keccak256HexToBigInt = function (signal) {
    var signalAsBuffer = Buffer.from(signal.slice(2), 'hex');
    var signalHashRaw = ethers.utils.solidityKeccak256(['bytes'], [signalAsBuffer]);
    var signalHashRawAsBytes = Buffer.from(signalHashRaw.slice(2), 'hex');
    var signalHash = utils_1.beBuff2int(signalHashRawAsBytes.slice(0, 31));
    return signalHash;
};
var genSignalHash = function (x) { return keccak256HexToBigInt(ethers.utils.hexlify(x)); };
exports.genSignalHash = genSignalHash;
var genCircuit = function (circuitDefinition) {
    return new snarkjs.Circuit(circuitDefinition);
};
exports.genCircuit = genCircuit;
var genWitness = function (signal, circuit, identity, idCommitments, treeDepth, externalNullifier) {
    return _genWitness(signal, circuit, identity, idCommitments, treeDepth, externalNullifier, function (signal) {
        return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(signal));
    });
};
exports.genWitness = genWitness;
var genMixerWitness = function (circuit, identity, idCommitments, treeDepth, recipientAddress, forwarderAddress, feeAmt, externalNullifier) {
    var signal = genMixerSignal(recipientAddress, forwarderAddress, feeAmt);
    return _genWitness(signal, circuit, identity, idCommitments, treeDepth, externalNullifier, function (x) { return x; });
};
exports.genMixerWitness = genMixerWitness;
var _genWitness = function (signal, circuit, identity, idCommitments, treeDepth, externalNullifier, transformSignalToHex) { return __awaiter(void 0, void 0, void 0, function () {
    var idCommitmentsAsBigInts, _i, idCommitments_1, idc, identityCommitment, index, tree, identityPath, _a, identityPathElements, identityPathIndex, signalHash, _b, signature, msg, witness;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                idCommitmentsAsBigInts = [];
                for (_i = 0, idCommitments_1 = idCommitments; _i < idCommitments_1.length; _i++) {
                    idc = idCommitments_1[_i];
                    idCommitmentsAsBigInts.push(snarkjs.bigInt(idc.toString()));
                }
                identityCommitment = genIdentityCommitment(identity);
                index = idCommitmentsAsBigInts.indexOf(identityCommitment);
                return [4 /*yield*/, genTree(treeDepth, idCommitments)];
            case 1:
                tree = _c.sent();
                return [4 /*yield*/, tree.path(index)];
            case 2:
                identityPath = _c.sent();
                return [4 /*yield*/, genPathElementsAndIndex(tree, identityCommitment)];
            case 3:
                _a = _c.sent(), identityPathElements = _a.identityPathElements, identityPathIndex = _a.identityPathIndex;
                signalHash = keccak256HexToBigInt(transformSignalToHex(signal));
                _b = genSignedMsg(identity.keypair.privKey, externalNullifier, signalHash), signature = _b.signature, msg = _b.msg;
                witness = circuit.calculateWitness({
                    'identity_pk[0]': identity.keypair.pubKey[0],
                    'identity_pk[1]': identity.keypair.pubKey[1],
                    'auth_sig_r[0]': signature.R8[0],
                    'auth_sig_r[1]': signature.R8[1],
                    auth_sig_s: signature.S,
                    signal_hash: signalHash,
                    external_nullifier: externalNullifier,
                    identity_nullifier: identity.identityNullifier,
                    identity_trapdoor: identity.identityTrapdoor,
                    identity_path_elements: identityPathElements,
                    identity_path_index: identityPathIndex,
                    fake_zero: snarkjs.bigInt(0)
                });
                return [2 /*return*/, {
                        witness: witness,
                        signal: signal,
                        signalHash: signalHash,
                        signature: signature,
                        msg: msg,
                        tree: tree,
                        identityPath: identityPath,
                        identityPathIndex: identityPathIndex,
                        identityPathElements: identityPathElements
                    }];
        }
    });
}); };
var setupTree = function (levels, prefix) {
    if (prefix === void 0) { prefix = 'semaphore'; }
    var storage = new MemStorage();
    var hasher = new MimcSpongeHasher();
    return new MerkleTree(prefix, storage, hasher, levels, ethers.utils.solidityKeccak256(['bytes'], [ethers.utils.toUtf8Bytes('Semaphore')]));
};
exports.setupTree = setupTree;
var genProof = function (witness, provingKey) { return __awaiter(void 0, void 0, void 0, function () {
    var witnessBin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                witnessBin = utils_1.convertWitness(snarkjs.stringifyBigInts(witness));
                return [4 /*yield*/, utils_1.prove(witnessBin.buffer, provingKey.buffer)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.genProof = genProof;
var genPublicSignals = function (witness, circuit) {
    return witness.slice(1, circuit.nPubInputs + circuit.nOutputs + 1);
};
exports.genPublicSignals = genPublicSignals;
var parseVerifyingKeyJson = function (verifyingKeyStr) {
    return snarkjs.unstringifyBigInts(JSON.parse(verifyingKeyStr));
};
exports.parseVerifyingKeyJson = parseVerifyingKeyJson;
var verifyProof = function (verifyingKey, proof, publicSignals) {
    return snarkjs.groth.isValid(verifyingKey, proof, publicSignals);
};
exports.verifyProof = verifyProof;
var formatForVerifierContract = function (proof, publicSignals) {
    var stringify = function (x) { return x.toString(); };
    return {
        a: [proof.pi_a[0].toString(), proof.pi_a[1].toString()],
        b: [
            [proof.pi_b[0][1].toString(), proof.pi_b[0][0].toString()],
            [proof.pi_b[1][1].toString(), proof.pi_b[1][0].toString()],
        ],
        c: [proof.pi_c[0].toString(), proof.pi_c[1].toString()],
        input: publicSignals.map(stringify)
    };
};
exports.formatForVerifierContract = formatForVerifierContract;
var cutOrExpandHexToBytes = function (hexStr, bytes) {
    var len = bytes * 2;
    var h = hexStr.slice(2, len + 2);
    return '0x' + h.padStart(len, '0');
};
/*
 * Each external nullifier must be at most 29 bytes large. This function
 * keccak-256-hashes a given `plaintext`, takes the last 29 bytes, and pads it
 * (from the start) with 0s, and returns the resulting hex string.
 * @param plaintext The plaintext to hash
 * @return plaintext The 0-padded 29-byte external nullifier
 */
var genExternalNullifier = function (plaintext) {
    var hashed = ethers.utils.solidityKeccak256(['string'], [plaintext]);
    return cutOrExpandHexToBytes('0x' + hashed.slice(8), 32);
};
exports.genExternalNullifier = genExternalNullifier;
var genBroadcastSignalParams = function (witnessData, proof, publicSignals) {
    var formatted = formatForVerifierContract(proof, publicSignals);
    return {
        signal: ethers.utils.toUtf8Bytes(witnessData.signal),
        proof: __spreadArrays(formatted.a, formatted.b[0], formatted.b[1], formatted.c),
        root: formatted.input[0],
        nullifiersHash: formatted.input[1],
        // The signal hash (formatted.input[2]) isn't passed to broadcastSignal
        // as the contract will generate (and then verify) it
        externalNullifier: formatted.input[3]
    };
};
exports.genBroadcastSignalParams = genBroadcastSignalParams;
//# sourceMappingURL=index.js.map