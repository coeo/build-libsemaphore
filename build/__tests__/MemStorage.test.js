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
var assert = chai.assert;
var expect = chai.expect;
var storage_1 = require("../storage");
var db = new storage_1.MemStorage();
describe('db test', function () {
    var _this = this;
    it('tests simple put/get', function () { return __awaiter(_this, void 0, void 0, function () {
        var testkey, rand_string, _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    testkey = 'testkey';
                    rand_string = uuidv4();
                    return [4 /*yield*/, db.put(testkey, rand_string)];
                case 1:
                    _j.sent();
                    _b = (_a = assert).equal;
                    return [4 /*yield*/, db.get(testkey)];
                case 2:
                    _b.apply(_a, [_j.sent(), rand_string]);
                    _d = (_c = assert).notEqual;
                    return [4 /*yield*/, db.get(testkey)];
                case 3:
                    _d.apply(_c, [_j.sent(), '']);
                    expect(db.get('b')).to.be.rejected;
                    _f = (_e = assert).equal;
                    return [4 /*yield*/, db.get_or_element('b', 5)];
                case 4:
                    _f.apply(_e, [_j.sent(), 5]);
                    _h = (_g = assert).notEqual;
                    return [4 /*yield*/, db.get_or_element('b', 6)];
                case 5:
                    _h.apply(_g, [_j.sent(), 5]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('tries put batch', function () { return __awaiter(_this, void 0, void 0, function () {
        var testkey1, rand_string1, testkey2, rand_string2, rand_string3, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    testkey1 = 'testkey1';
                    rand_string1 = uuidv4();
                    testkey2 = 'testkey2';
                    rand_string2 = uuidv4();
                    rand_string3 = uuidv4();
                    return [4 /*yield*/, db.put_batch([
                            { key: testkey1, value: rand_string1 },
                            { key: testkey2, value: rand_string2 },
                            { key: testkey1, value: rand_string3 },
                        ])];
                case 1:
                    _e.sent();
                    _b = (_a = assert).equal;
                    return [4 /*yield*/, db.get(testkey1)];
                case 2:
                    _b.apply(_a, [_e.sent(), rand_string3]);
                    _d = (_c = assert).equal;
                    return [4 /*yield*/, db.get(testkey2)];
                case 3:
                    _d.apply(_c, [_e.sent(), rand_string2]);
                    expect(db.get('testkey3')).to.be.rejected;
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=MemStorage.test.js.map