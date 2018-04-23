"use strict";
// Created by nullice on 2018/04/17 - 14:39 
exports.__esModule = true;
var giveHandler_1 = require("./giveHandler");
var GOB_CORE_NAME = "[Gob Core]";
var GobCore = /** @class */ (function () {
    function GobCore() {
        this.isGob = 3;
        this.data = {};
    }
    return GobCore;
}());
exports.GobCore = GobCore;
function GobFactory() {
    var gobCore = new GobCore();
    var proxy = new Proxy(gobCore.data, giveHandler_1["default"](gobCore, [], GOB_CORE_NAME));
    proxy[GOB_CORE_NAME] = gobCore;
    return proxy;
}
exports["default"] = GobFactory;
