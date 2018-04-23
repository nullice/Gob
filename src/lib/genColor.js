"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 转换一个色彩对象为文本
 * @param {Color} inColor - 色彩对象
 * @param {boolean} [upperCase] - 是否大写
 * @return {string}
 */
function genColor(inColor, upperCase) {
    let re = `rgb(${inColor.r},${inColor.g},${inColor.b})`;
    return upperCase ? re.toUpperCase() : re;
}
exports.default = genColor;
//# sourceMappingURL=genColor.js.map