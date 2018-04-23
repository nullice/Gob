"use strict";
// Created by nullice on 2018/04/17 - 14:39 
Object.defineProperty(exports, "__esModule", { value: true });
const giveHandler_1 = require("./giveHandler");
const GOB_CORE_NAME = "[Gob Core]";
class GobCore {
    constructor() {
        this.isGob = 3;
        this.data = {};
    }
}
exports.GobCore = GobCore;
function GobFactory() {
    let gobCore = new GobCore();
    let proxy = new Proxy(gobCore.data, giveHandler_1.default(gobCore, [], GOB_CORE_NAME));
    proxy[GOB_CORE_NAME] = gobCore;
    return proxy;
}
exports.default = GobFactory;
//# sourceMappingURL=index.js.map