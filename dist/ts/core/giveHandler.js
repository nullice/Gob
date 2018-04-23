"use strict";
exports.__esModule = true;
var RichangEs_js_1 = require("richang.js/dist/RichangEs.js");
function giveHandler(gobCore, path, GOB_CORE_NAME) {
    var data = gobCore.data;
    return {
        "set": function (target, key, value) {
            console.log("[set]", path, { target: target, key: key, value: value });
            // 处理特殊属性 [Gob Core]
            if (key == GOB_CORE_NAME) {
                return true;
            }
            RichangEs_js_1.Object.setObjectValueByNames(data, path.concat([key]), value);
            target[key] = value;
            return true;
        },
        "get": function (target, property) {
            // 处理特殊属性 [Gob Core]
            if (property == GOB_CORE_NAME) {
                return gobCore;
            }
            RichangEs_js_1.Object.getObjectValueByNames(data, path.concat([property]), null);
            console.log("[get]", path, { target: target, property: property });
            return target[property];
        }
    };
}
exports["default"] = giveHandler;
