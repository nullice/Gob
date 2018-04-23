"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rc = require("richang.js/dist/RichangNode.js");
function giveHandler(gobCore, path, GOB_CORE_NAME) {
    let data = gobCore.data;
    return {
        "set": function (target, key, value) {
            console.log("[set]", path, { target, key, value });
            // 处理特殊属性 [Gob Core]
            if (key == GOB_CORE_NAME) {
                return true;
            }
            rc.Object.setObjectValueByNames(data, [...path, key], value);
            target[key] = value;
            return true;
        },
        "get": function (target, property) {
            // 处理特殊属性 [Gob Core]
            if (property == GOB_CORE_NAME) {
                return gobCore;
            }
            rc.Object.getObjectValueByNames(data, [...path, property]);
            console.log("[get]", path, { target, property });
            return target[property];
        },
    };
}
exports.default = giveHandler;
//# sourceMappingURL=giveHandler.js.map