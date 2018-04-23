"use strict";
/**
 * say hai boy
 * @param {string} text - 一段文本
 * @return {string}
 */
Object.defineProperty(exports, "__esModule", { value: true });
let os = require("os");
function sayHi(text) {
    return (() => {
        return "😜：hi：" + text + os.arch();
    })();
}
exports.default = sayHi;
//# sourceMappingURL=sayHi.js.map