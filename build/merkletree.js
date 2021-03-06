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
var AwaitLock = require('await-lock');
var MerkleTree = /** @class */ (function () {
    function MerkleTree(prefix, storage, hasher, n_levels, zero_value) {
        this.prefix = prefix;
        this.storage = storage;
        this.hasher = hasher;
        this.n_levels = n_levels;
        this.zero_values = [];
        var current_zero_value = zero_value;
        this.zero_values.push(current_zero_value);
        for (var i = 0; i < n_levels; i++) {
            current_zero_value = this.hasher.hash(i, current_zero_value, current_zero_value);
            this.zero_values.push(current_zero_value.toString());
        }
        this.lock = new AwaitLock();
    }
    MerkleTree.index_to_key = function (prefix, level, index) {
        var key = prefix + "_tree_" + level + "_" + index;
        return key;
    };
    MerkleTree.element_to_key = function (prefix, element) {
        var key = prefix + "_element_" + element;
        return key;
    };
    MerkleTree.update_log_to_key = function (prefix) {
        return prefix + "_update_log_index";
    };
    MerkleTree.update_log_element_to_key = function (prefix, update_log_index) {
        return prefix + "_update_log_element_" + update_log_index;
    };
    MerkleTree.prototype.update_log = function (index, old_element, new_element, update_log_index, should_put_element_update) {
        return __awaiter(this, void 0, void 0, function () {
            var ops, update_log_key, update_log_element_key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ops = [];
                        update_log_key = MerkleTree.update_log_to_key(this.prefix);
                        ops.push({
                            type: 'put',
                            key: update_log_key,
                            value: update_log_index.toString()
                        });
                        if (should_put_element_update) {
                            update_log_element_key = MerkleTree.update_log_element_to_key(this.prefix, update_log_index);
                            ops.push({
                                type: 'put',
                                key: update_log_element_key,
                                value: JSON.stringify({
                                    index: index,
                                    old_element: old_element,
                                    new_element: new_element
                                })
                            });
                        }
                        return [4 /*yield*/, this.storage.put_batch(ops)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MerkleTree.prototype.root = function () {
        return __awaiter(this, void 0, void 0, function () {
            var root;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, this.n_levels, 0), this.zero_values[this.n_levels])];
                    case 1:
                        root = _a.sent();
                        return [2 /*return*/, root];
                }
            });
        });
    };
    MerkleTree.prototype.element_index = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var element_key, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        element_key = MerkleTree.element_to_key(this.prefix, element);
                        return [4 /*yield*/, this.storage.get_or_element(element_key, -1)];
                    case 1:
                        index = _a.sent();
                        return [2 /*return*/, parseInt(index)];
                }
            });
        });
    };
    MerkleTree.prototype.path = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var PathTraverser, traverser, root, element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        PathTraverser = /** @class */ (function () {
                            function PathTraverser(prefix, storage, zero_values) {
                                this.prefix = prefix;
                                this.storage = storage;
                                this.zero_values = zero_values;
                                this.path_elements = [];
                                this.path_index = [];
                            }
                            PathTraverser.prototype.handle_index = function (level, element_index, sibling_index) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var sibling;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, level, sibling_index), this.zero_values[level])];
                                            case 1:
                                                sibling = _a.sent();
                                                this.path_elements.push(sibling);
                                                this.path_index.push(element_index % 2);
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            };
                            return PathTraverser;
                        }());
                        traverser = new PathTraverser(this.prefix, this.storage, this.zero_values);
                        return [4 /*yield*/, this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, this.n_levels, 0), this.zero_values[this.n_levels])];
                    case 1:
                        root = _a.sent();
                        return [4 /*yield*/, this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, 0, index), this.zero_values[0])];
                    case 2:
                        element = _a.sent();
                        return [4 /*yield*/, this.traverse(index, traverser)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, {
                                root: root,
                                path_elements: traverser.path_elements,
                                path_index: traverser.path_index,
                                element: element
                            }];
                }
            });
        });
    };
    MerkleTree.prototype.update = function (index, leaf, update_log_index, lock_already_acquired) {
        return __awaiter(this, void 0, void 0, function () {
            var element, UpdateTraverser, traverser, update_log_key, update_log_index_from_db, root;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        element = leaf.toString();
                        if (!!lock_already_acquired) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.lock.acquireAsync()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 12, 13]);
                        UpdateTraverser = /** @class */ (function () {
                            function UpdateTraverser(prefix, storage, hasher, element, zero_values) {
                                this.prefix = prefix;
                                this.current_element = element;
                                this.zero_values = zero_values;
                                this.storage = storage;
                                this.hasher = hasher;
                                this.key_values_to_put = [];
                            }
                            UpdateTraverser.prototype.handle_index = function (level, element_index, sibling_index) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var _a, sibling, left, right;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (!(level == 0)) return [3 /*break*/, 2];
                                                _a = this;
                                                return [4 /*yield*/, this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, level, element_index), this.zero_values[level])];
                                            case 1:
                                                _a.original_element = _b.sent();
                                                this.key_values_to_put.push({
                                                    key: MerkleTree.element_to_key(this.prefix, element),
                                                    value: index.toString()
                                                });
                                                _b.label = 2;
                                            case 2: return [4 /*yield*/, this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, level, sibling_index), this.zero_values[level])];
                                            case 3:
                                                sibling = _b.sent();
                                                if (element_index % 2 == 0) {
                                                    left = this.current_element;
                                                    right = sibling;
                                                }
                                                else {
                                                    left = sibling;
                                                    right = this.current_element;
                                                }
                                                this.key_values_to_put.push({
                                                    key: MerkleTree.index_to_key(this.prefix, level, element_index),
                                                    value: this.current_element
                                                });
                                                //console.log(`left: ${left}, right: ${right}`);
                                                this.current_element = this.hasher.hash(level, left, right);
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            };
                            return UpdateTraverser;
                        }());
                        traverser = new UpdateTraverser(this.prefix, this.storage, this.hasher, element, this.zero_values);
                        return [4 /*yield*/, this.traverse(index, traverser)];
                    case 3:
                        _a.sent();
                        //console.log(`traverser.current_element: ${traverser.current_element}`);
                        traverser.key_values_to_put.push({
                            key: MerkleTree.index_to_key(this.prefix, this.n_levels, 0),
                            value: traverser.current_element
                        });
                        if (!(update_log_index == undefined)) return [3 /*break*/, 6];
                        update_log_key = MerkleTree.update_log_to_key(this.prefix);
                        return [4 /*yield*/, this.storage.get_or_element(update_log_key, -1)];
                    case 4:
                        update_log_index_from_db = _a.sent();
                        update_log_index = parseInt(update_log_index_from_db) + 1;
                        return [4 /*yield*/, this.update_log(index, traverser.original_element, element, update_log_index, true)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.update_log(index, traverser.original_element, element, update_log_index, false)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [4 /*yield*/, this.storage.del(MerkleTree.element_to_key(this.prefix, traverser.original_element))];
                    case 9:
                        _a.sent();
                        //traverser.key_values_to_put.forEach((e) => console.log(`key_values: ${JSON.stringify(e)}`));
                        return [4 /*yield*/, this.storage.put_batch(traverser.key_values_to_put)];
                    case 10:
                        //traverser.key_values_to_put.forEach((e) => console.log(`key_values: ${JSON.stringify(e)}`));
                        _a.sent();
                        return [4 /*yield*/, this.root()];
                    case 11:
                        root = _a.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        if (!lock_already_acquired) {
                            this.lock.release();
                        }
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    MerkleTree.prototype.traverse = function (index, handler) {
        return __awaiter(this, void 0, void 0, function () {
            var current_index, i, sibling_index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        current_index = index;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.n_levels)) return [3 /*break*/, 4];
                        sibling_index = current_index;
                        if (current_index % 2 == 0) {
                            sibling_index += 1;
                        }
                        else {
                            sibling_index -= 1;
                        }
                        return [4 /*yield*/, handler.handle_index(i, current_index, sibling_index)];
                    case 2:
                        _a.sent();
                        current_index = Math.floor(current_index / 2);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MerkleTree.prototype.rollback = function (updates) {
        return __awaiter(this, void 0, void 0, function () {
            var update_log_key, update_log_index, i, update_log_element_key, update_element_log, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.lock.acquireAsync()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, , 9, 10]);
                        update_log_key = MerkleTree.update_log_to_key(this.prefix);
                        return [4 /*yield*/, this.storage.get(update_log_key)];
                    case 3:
                        update_log_index = _c.sent();
                        i = 0;
                        _c.label = 4;
                    case 4:
                        if (!(i < updates)) return [3 /*break*/, 8];
                        update_log_element_key = MerkleTree.update_log_element_to_key(this.prefix, update_log_index - i);
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, this.storage.get(update_log_element_key)];
                    case 5:
                        update_element_log = _b.apply(_a, [_c.sent()]);
                        return [4 /*yield*/, this.update(update_element_log.index, update_element_log.old_element, update_log_index - i - 1, true)];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 4];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        this.lock.release();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    MerkleTree.prototype.rollback_to_root = function (root) {
        return __awaiter(this, void 0, void 0, function () {
            var update_log_key, update_log_index, update_log_element_key, update_element_log, _a, _b, current_root;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.lock.acquireAsync()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, , 10, 11]);
                        update_log_key = MerkleTree.update_log_to_key(this.prefix);
                        return [4 /*yield*/, this.storage.get(update_log_key)];
                    case 3:
                        update_log_index = _c.sent();
                        _c.label = 4;
                    case 4:
                        if (!(update_log_index >= 0)) return [3 /*break*/, 8];
                        update_log_element_key = MerkleTree.update_log_element_to_key(this.prefix, update_log_index);
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, this.storage.get(update_log_element_key)];
                    case 5:
                        update_element_log = _b.apply(_a, [_c.sent()]);
                        return [4 /*yield*/, this.update(update_element_log.index, update_element_log.old_element, update_log_index, true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, this.root()];
                    case 7:
                        current_root = _c.sent();
                        if (current_root == root) {
                            return [3 /*break*/, 8];
                        }
                        update_log_index -= 1;
                        return [3 /*break*/, 4];
                    case 8: return [4 /*yield*/, this.root()];
                    case 9:
                        if ((_c.sent()) != root) {
                            throw new Error("could not rollback to root " + root);
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        this.lock.release();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return MerkleTree;
}());
exports["default"] = MerkleTree;
//# sourceMappingURL=merkletree.js.map