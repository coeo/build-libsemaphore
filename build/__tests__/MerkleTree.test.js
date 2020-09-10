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
var assert = chai.assert;
var storage_1 = require("../storage");
var hashers_1 = require("../hashers");
var merkletree_1 = require("../merkletree");
var storage = new storage_1.MemStorage();
jest.setTimeout(9000);
describe('tree test', function () {
    var _this = this;
    var prefix = 'test';
    var default_value = '4';
    var depth = 2;
    var hasher = new hashers_1.Mimc7Hasher();
    var rollback_root;
    var tree = new merkletree_1["default"](prefix, storage, hasher, depth, default_value);
    it('tests index', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            assert.equal(merkletree_1["default"].index_to_key('test', 5, 20), "test_tree_5_20");
            return [2 /*return*/];
        });
    }); });
    it('tests empty get', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, root, path_elements, path_index, calculated_root;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, tree.path(2)];
                case 1:
                    _a = _b.sent(), root = _a.root, path_elements = _a.path_elements, path_index = _a.path_index;
                    calculated_root = hasher.hash(1, path_elements[1], hasher.hash(0, default_value, path_elements[0]));
                    assert.equal(root, calculated_root);
                    return [2 /*return*/];
            }
        });
    }); });
    it('tests insert', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, root, path_elements, path_index, calculated_root;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, tree.update(0, '5')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, tree.path(0)];
                case 2:
                    rollback_root = (_b.sent()).root;
                    return [4 /*yield*/, tree.path(0)];
                case 3:
                    _a = _b.sent(), root = _a.root, path_elements = _a.path_elements, path_index = _a.path_index;
                    calculated_root = hasher.hash(1, hasher.hash(0, '5', path_elements[0]), path_elements[1]);
                    assert.equal(root, calculated_root);
                    return [2 /*return*/];
            }
        });
    }); });
    it('tests updated', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, root, path_elements, path_index, calculated_root, wrong_calculated_root;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, tree.update(1, '6')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, tree.update(2, '9')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, tree.update(2, '8')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, tree.update(2, '82')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, tree.path(0)];
                case 5:
                    _a = _b.sent(), root = _a.root, path_elements = _a.path_elements, path_index = _a.path_index;
                    calculated_root = hasher.hash(1, hasher.hash(0, '5', path_elements[0]), path_elements[1]);
                    assert.equal(root, calculated_root);
                    wrong_calculated_root = hasher.hash(1, hasher.hash(0, '6', path_elements[0]), path_elements[1]);
                    assert.notEqual(root, wrong_calculated_root);
                    return [2 /*return*/];
            }
        });
    }); });
    it('tests if path consistent', function () { return __awaiter(_this, void 0, void 0, function () {
        var p1, index, p2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tree.update(1, '6')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tree.update(2, '9')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, tree.update(3, '8')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tree.update(4, '82')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tree.path(2)];
                case 5:
                    p1 = _a.sent();
                    return [4 /*yield*/, tree.element_index('9')];
                case 6:
                    index = _a.sent();
                    return [4 /*yield*/, tree.path(index)];
                case 7:
                    p2 = _a.sent();
                    assert.strictEqual(index, 2);
                    assert.equal(typeof (index), "number");
                    assert.equal(p1.path_elements.toString(), p2.path_elements.toString());
                    return [2 /*return*/];
            }
        });
    }); });
    it('tests update log', function () { return __awaiter(_this, void 0, void 0, function () {
        var update_log_key, update_log_index, update_log_element_key, update_log_element, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    update_log_key = merkletree_1["default"].update_log_to_key(prefix);
                    return [4 /*yield*/, tree.storage.get(update_log_key)];
                case 1:
                    update_log_index = _c.sent();
                    assert.equal(update_log_index, 4);
                    update_log_element_key = merkletree_1["default"].update_log_element_to_key(prefix, update_log_index);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, tree.storage.get(update_log_element_key)];
                case 2:
                    update_log_element = _b.apply(_a, [_c.sent()]);
                    assert.equal(update_log_element.old_element, '8');
                    assert.equal(update_log_element.new_element, '82');
                    return [2 /*return*/];
            }
        });
    }); });
    it('tests rollback', function () { return __awaiter(_this, void 0, void 0, function () {
        var update_log_key, update_log_index, update_log_element_key, update_log_element, _a, _b, update_log_key, update_log_index, update_log_element_key, update_log_element, _c, _d, update_log_key, update_log_index, update_log_element_key, update_log_element, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, tree.rollback(1)];
                case 1:
                    _g.sent();
                    update_log_key = merkletree_1["default"].update_log_to_key(prefix);
                    return [4 /*yield*/, tree.storage.get(update_log_key)];
                case 2:
                    update_log_index = _g.sent();
                    assert.equal(update_log_index, 3);
                    update_log_element_key = merkletree_1["default"].update_log_element_to_key(prefix, update_log_index);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, tree.storage.get(update_log_element_key)];
                case 3:
                    update_log_element = _b.apply(_a, [_g.sent()]);
                    assert.equal(update_log_element.old_element, '9');
                    assert.equal(update_log_element.new_element, '8');
                    return [4 /*yield*/, tree.rollback(1)];
                case 4:
                    _g.sent();
                    update_log_key = merkletree_1["default"].update_log_to_key(prefix);
                    return [4 /*yield*/, tree.storage.get(update_log_key)];
                case 5:
                    update_log_index = _g.sent();
                    assert.equal(update_log_index, 2);
                    update_log_element_key = merkletree_1["default"].update_log_element_to_key(prefix, update_log_index);
                    _d = (_c = JSON).parse;
                    return [4 /*yield*/, tree.storage.get(update_log_element_key)];
                case 6:
                    update_log_element = _d.apply(_c, [_g.sent()]);
                    assert.equal(update_log_element.old_element, '4');
                    assert.equal(update_log_element.new_element, '9');
                    return [4 /*yield*/, tree.rollback_to_root(rollback_root)];
                case 7:
                    _g.sent();
                    update_log_key = merkletree_1["default"].update_log_to_key(prefix);
                    return [4 /*yield*/, tree.storage.get(update_log_key)];
                case 8:
                    update_log_index = _g.sent();
                    assert.equal(update_log_index, 1);
                    update_log_element_key = merkletree_1["default"].update_log_element_to_key(prefix, update_log_index);
                    _f = (_e = JSON).parse;
                    return [4 /*yield*/, tree.storage.get(update_log_element_key)];
                case 9:
                    update_log_element = _f.apply(_e, [_g.sent()]);
                    assert.equal(update_log_element.old_element, '4');
                    assert.equal(update_log_element.new_element, '6');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=MerkleTree.test.js.map