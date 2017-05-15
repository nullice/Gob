(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Gob = factory());
}(this, (function () { 'use strict';

/**
 * Created by bgllj on 2016/12/11.
 */

//      ___                       ___           ___           ___           ___           ___
//     /\  \                     /\__\         /\  \         /\  \         /\  \         /\__\
//    /::\  \       ___         /:/  /         \:\  \       /::\  \        \:\  \       /:/ _/_
//   /:/\:\__\     /\__\       /:/  /           \:\  \     /:/\:\  \        \:\  \     /:/ /\  \
//  /:/ /:/  /    /:/__/      /:/  /  ___   ___ /::\  \   /:/ /::\  \   _____\:\  \   /:/ /::\  \
// /:/_/:/__/___ /::\  \     /:/__/  /\__\ /\  /:/\:\__\ /:/_/:/\:\__\ /::::::::\__\ /:/__\/\:\__\
// \:\/:::::/  / \/\:\  \__  \:\  \ /:/  / \:\/:/  \/__/ \:\/:/  \/__/ \:\~~\~~\/__/ \:\  \ /:/  /
//  \::/~~/~~~~   ~~\:\/\__\  \:\  /:/  /   \::/__/       \::/__/       \:\  \        \:\  /:/  /
//   \:\~~\          \::/  /   \:\/:/  /     \:\  \        \:\  \        \:\  \        \:\/:/  /
//    \:\__\         /:/  /     \::/  /       \:\__\        \:\__\        \:\__\        \::/  /
//     \/__/         \/__/       \/__/         \/__/         \/__/         \/__/         \/__/
//
//
//                日常
//        +-------------------+
//        |   Richang  JSEX   |
//        +-------------------+
//              · typeTYP ·
//
//       By nullice ui@nullice.com
//             nullice.com
//            license: LGPL


var typeTYP = {

    /**
     * 得到指定值的数据类型。返回数据类型名称字符串，如 "boolean","object","string" 。
     * @param value
     * @returns {*}
     */
    type: function (value) {
        var typeList = {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regexp",
            "[object Object]": "object",
            "[object Error]": "error"
        };
        if (value === null) {
            return "null";
        } else if (typeof value === "undefined") {
            return "undefined";
        } else {
            return typeof value === "object" || typeof value === "function" ? typeList[typeList.toString.call(value)] || "object" : typeof value;
        }
    }

};

/**
 * Created by bgllj on 2016/10/26.
 */

//      ___                       ___           ___           ___           ___           ___
//     /\  \                     /\__\         /\  \         /\  \         /\  \         /\__\
//    /::\  \       ___         /:/  /         \:\  \       /::\  \        \:\  \       /:/ _/_
//   /:/\:\__\     /\__\       /:/  /           \:\  \     /:/\:\  \        \:\  \     /:/ /\  \
//  /:/ /:/  /    /:/__/      /:/  /  ___   ___ /::\  \   /:/ /::\  \   _____\:\  \   /:/ /::\  \
// /:/_/:/__/___ /::\  \     /:/__/  /\__\ /\  /:/\:\__\ /:/_/:/\:\__\ /::::::::\__\ /:/__\/\:\__\
// \:\/:::::/  / \/\:\  \__  \:\  \ /:/  / \:\/:/  \/__/ \:\/:/  \/__/ \:\~~\~~\/__/ \:\  \ /:/  /
//  \::/~~/~~~~   ~~\:\/\__\  \:\  /:/  /   \::/__/       \::/__/       \:\  \        \:\  /:/  /
//   \:\~~\          \::/  /   \:\/:/  /     \:\  \        \:\  \        \:\  \        \:\/:/  /
//    \:\__\         /:/  /     \::/  /       \:\__\        \:\__\        \:\__\        \::/  /
//     \/__/         \/__/       \/__/         \/__/         \/__/         \/__/         \/__/
//
//
//                日常
//        +-------------------+
//        |   Richang  JSEX   |
//        +-------------------+
//             · objectOBJ ·
//
//       By nullice ui@nullice.com
//             nullice.com
//            license: LGPL


var objectOBJ = {

    /**
     * 对象是否为空
     * @param obj
     * @returns {boolean}
     */
    isEmptyObject: function (obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    },

    /**
     * 复制对象。可控制要复制的属性，复制后的属性名，处理新属性值
     * @param ob1 源对象
     * @param ob2 目标对象
     * @param func_allowCopy 判断是否允许复制的函数，返回真允许复制 func_allowCopy(属性名,属性值)。可空
     * @param func_rename 重命名复制到目标对象上的属性名， 返回新属性名 func_rename(属性名,属性值)。可空
     * @param func_valueFiter 处理复制到目标对象上的属性值，返回处理后的属性值 func_rename(属性名,属性值)。可空
     * @param func_for 每次循环执行的函数 func_for(ob1,ob2,x)。可空
     */

    objectCopyToObject: function (ob1, ob2, func_allowCopy, func_rename, func_valueFiter, func_for) {

        if (ob2 == undefined) {
            return;
        }
        for (var x in ob1) {

            if (func_for != undefined) {
                func_for(ob1, ob2, x);
            }

            var _allowCopy = true;
            if (func_allowCopy != undefined) {
                _allowCopy = func_allowCopy(x, ob1[x]);
            }

            var name = x;
            if (func_rename != undefined) {
                name = func_rename(x, ob1[x]);
            }

            if (ob1[x] != undefined && ob1[x].constructor === Object) {
                if (typeof ob2[name] !== "object") {
                    ob2[name] = {};
                }

                this.objectCopyToObject(ob1[x], ob2[name], func_allowCopy, func_rename, func_valueFiter);
            } else {

                if (func_valueFiter != undefined) {
                    ob2[name] = func_valueFiter(x, ob1[x]);
                } else {

                    ob2[name] = ob1[x];
                }
            }
        }
    },

    /**
     * 根据属性名路径列表（names）获取对象属性的值
     * @param object 对象
     * @param names 属性名路径列表，如 [position,enableAssigns,y]
     * @param aheadEndTime 提取结束个数，如设置为 1 则是获取倒数第 2 个属性的值，
     * @returns {*}
     * @private
     */
    getObjectValueByNames: function (object, names, aheadEndTime) {
        var nowValue;
        for (var i = 0; i < names.length - (aheadEndTime || 0); i++) {
            if (i == 0) {
                if (object[names[i]] != undefined) {
                    nowValue = object[names[i]];
                } else {
                    return null;
                }
            } else {

                if (nowValue[names[i]] != undefined) {
                    nowValue = nowValue[names[i]];
                } else {
                    return null;
                }
            }
        }

        return nowValue;
    },

    /**
     * 根据属性名路径列表（names）对对象属性赋值
     * @param object 对象
     * @param names 属性名路径列表，如 [position,enableAssigns,y]
     * @param value 值
     */
    setObjectValueByNames: function (object, names, value) {
        var nowObject;

        if (names.length == 1) {
            object[names[0]] = value;
            return;
        }

        for (var i = 0; i < names.length; i++) {
            if (i == 0 && names.length > 2) {
                if (object[names[0]] == undefined) {
                    object[names[0]] = {};
                }
                nowObject = object[names[0]];
            } else if (i < names.length - 2 && names.length > 2) {
                if (nowObject[names[i]] == undefined) {
                    nowObject[names[i]] = {};
                }

                nowObject = nowObject[names[i]];
            } else if (i == names.length - 2) {
                if (names.length == 2) {
                    if (object[names[0]] == undefined) {
                        object[names[0]] = {};
                    }
                    nowObject = object[names[0]];

                    nowObject[names[1]] = value;
                    return;
                } else {

                    if (nowObject[names[i]] == undefined) {
                        nowObject[names[i]] = {};
                    }

                    nowObject = nowObject[names[i]];
                    nowObject[names[i + 1]] = value;
                    return;
                }
            }
        }
    }

};

/**
 * 根据键名列表给对象成员设置值
 * 返回 false 则值未改变，如值改变可通过返回对象获取旧值{oldValue: oldValue}
 * @param object
 * @param keys
 * @param value
 * @returns {boolean}
 */
let setObjectValueByKeysAsync = (() => {
    var _ref2 = _asyncToGenerator(function* (object, keys, value, preFilters) {
        var nowObject;
        var change = false;

        if (keys.length == 1) {
            var oldValue = object[keys[0]];
            change = checkChange(oldValue, value);
            object[keys[0]] = yield valuePreFilterAsync(oldValue, value, keys, preFilters);
            return change;
        }

        for (var i = 0; i < keys.length; i++) {

            if (i == 0 && keys.length > 2) {
                if (object[keys[0]] == undefined) {
                    object[keys[0]] = {};
                }
                nowObject = object[keys[0]];
            } else if (i < keys.length - 2 && keys.length > 2) {
                if (nowObject[keys[i]] == undefined) {
                    nowObject[keys[i]] = {};
                }

                nowObject = nowObject[keys[i]];
            } else if (i == keys.length - 2) {
                if (keys.length === 2) {
                    if (object[keys[0]] == undefined) {
                        object[keys[0]] = {};
                    }
                    nowObject = object[keys[0]];
                    var oldValue = nowObject[keys[1]];
                    console.log(1.3);
                    change = checkChange(oldValue, value);
                    nowObject[keys[1]] = yield valuePreFilterAsync(oldValue, value, keys, preFilters);
                    console.log(2);
                    return change;
                } else {
                    if (nowObject[keys[i]] == undefined) {
                        nowObject[keys[i]] = {};
                    }
                    nowObject = nowObject[keys[i]];
                    var oldValue = nowObject[keys[i + 1]];
                    change = checkChange(oldValue, value);
                    nowObject[keys[i + 1]] = yield valuePreFilterAsync(oldValue, value, keys, preFilters);
                    return change;
                }
            }
        }
        return change;
    });

    return function setObjectValueByKeysAsync(_x4, _x5, _x6, _x7) {
        return _ref2.apply(this, arguments);
    };
})();

let valuePreFilterAsync = (() => {
    var _ref3 = _asyncToGenerator(function* (oldValue, newValue, keys, preFilters) {
        var finValue = newValue;
        console.log("finValue", finValue);
        if (preFilters != undefined && preFilters.length != undefined) {
            try {
                for (var i = 0; i < preFilters.length; i++) {
                    if (typeof preFilters[i].func === "function") {
                        finValue = yield preFilters[i].func(oldValue, finValue, keys);
                    }
                }
            } catch (e) {
                console.error("[Gob] valuePreFilterAsync()", e);
            }
        }
        return finValue;
    });

    return function valuePreFilterAsync(_x8, _x9, _x10, _x11) {
        return _ref3.apply(this, arguments);
    };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by nullice on 2017/5/14.
 */

var Gob = function () {
    this.$isGob = true;
    this.$_setCount = 0;
    /*set 调用次数*/
    this.$_changeCount = 0;
    /* 状态改变次数*/
    this.$_states = {};
    this.$fitlers = {
        preFilters: { __root: {} },
        finFilters: { __root: {} }
    };

    var self = this;
    // this.$addFilter("pre", "aysnc1", async function (oldValue, newValue, keys)
    // {
    //     await  self.sleep(2000)
    //     console.log(22222)
    //     return "[22222]"
    // }, [])


    return this;
};

/**
 * 添加一个过滤器
 * @param fitlerType 过滤器类型，前过滤器： pre, 后过滤器：fin
 * @param filterName 过滤器名称
 * @param filterFunction 过滤函数  newValue filter(oldValue, newValue, keys)
 * @param keyPath 键名路径
 * @param level  执行顺序级别
 * @param isAsync 是否是异步函数
 */
Gob.prototype.$addFilter = function (fitlerType, filterName, filterFunction, keyPath, level, isAsync) {
    if (arguments.length == 1 && typeTYP.type(arguments[0]) === "object") {
        try {
            var fitlerType = arguments[0].fitlerType;
            var filterName = arguments[0].filterName;
            var filterFunction = arguments[0].filterFunction;
            var keyPath = arguments[0].keyPath;
            var level = arguments[0].level;
            var isAsync = arguments[0].isAsync;
        } catch (e) {
            console.error("[Gob] $addFilter invalid arguments:", arguments);
            return;
        }
    }

    var keys = keyPathToKeys(keyPath);
    if (fitlerType === "pre") {
        var tragetFilters = this.$fitlers.preFilters;
    } else if (fitlerType === "fin") {
        var tragetFilters = this.$fitlers.finFilters;
    }

    console.log("$addFilter", tragetFilters, keys.concat(["__root", filterName]));

    if (typeof isAsync !== "boolean") {
        var isAsync = isAsyncFunction(filterFunction);
    }

    if (level == undefined) {
        level = 5;
    }

    objectOBJ.setObjectValueByNames(tragetFilters, keys.concat(["__root", filterName]), {
        filterName: filterName, /*过滤器名*/
        func: filterFunction, /*函数*/
        isAsync: isAsync, /*是否是异步函数*/
        level: level });
};

/**
 * 根据键名列表获取匹配的过滤器列表
 * @param fitlerType
 * @param keys
 * @returns {{hasAsync: boolean, filters: Array}}
 */
Gob.prototype.$_getFilterByKeys = function (fitlerType, keys) {
    var keys = keys.slice(0);
    if (fitlerType === "pre") {
        var tragetFilters = this.$fitlers.preFilters;
    } else if (fitlerType === "fin") {
        var tragetFilters = this.$fitlers.finFilters;
    }
    var filters = [];
    var hasAsync = false;
    for (var i = 0; i < keys.length + 2; i++) {
        var oncefilters = [];
        var onceKeys = keys.splice(0, keys.length - i);
        console.info("scan filter:", onceKeys.concat(["__root"]));
        var filtersOb = objectOBJ.getObjectValueByNames(tragetFilters, onceKeys.concat(["__root"]));
        for (var x in filtersOb) {
            if (filtersOb[x].isAsync) {
                hasAsync = true;
            }
            oncefilters.push(filtersOb[x]);
        }
        oncefilters.sort(function (a, b) {
            var result = b.level - a.level;
            if (result === 0) {
                var nameA = a.filterName.toUpperCase();
                var nameB = b.filterName.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
            }
            return result;
        });

        filters = oncefilters.concat(filters);
    }

    return { hasAsync: hasAsync, filters: filters };
};

/**
 * 根据键名列表获取键值
 * @param keys
 * @returns {Promise.<*>}
 */
Gob.prototype.$getValue = function (keys) {
    console.log("$getValue", keys, value);
    var value = objectOBJ.getObjectValueByNames(this.$_states, keys);
    return value;
};

Gob.prototype.$setValue = (() => {
    var _ref = _asyncToGenerator(function* (keys, value, onlySet) {
        console.log("$setValue", keys, value);
        //0. 计数
        this.$_setCount++;

        // 1. preFilter
        var filtersOb = this.$_getFilterByKeys("pre", keys);
        console.log("$setValue filtersOb", keys, filtersOb);

        console.log("hasAsync keys", keys, filtersOb.hasAsync);
        if (filtersOb.hasAsync) {
            var change = yield setObjectValueByKeysAsync(this.$_states, keys, value, filtersOb.filters);
        } else {
            var change = setObjectValueByKeys(this.$_states, keys, value, filtersOb.filters);
        }

        // var change =   OBJ.setObjectValueByNames(this.$_states, keys, value)

        if (change === false) {} else {
            this.$_changeCount++;
        }

        if (onlySet) {
            return;
        }
    });

    return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
})();

Gob.prototype.$newStates = function (object) {
    var self = this;
    giveSetter(object, [], 0, self, this);
};
Object.defineProperty(Gob.prototype, "$newStates", { writable: false });

/**
 *
 * @param object
 * @param keys
 * @param index
 * @param self
 */
function giveSetter(object, keys, index, self, gob) {
    for (var key in object) {
        var newKeys = keys.concat(key);
        var isObject = false;
        if (object[key] != undefined) {
            isObject = typeTYP.type(object[key]) === "object";
        }
        if (isObject && objectOBJ.isEmptyObject(object[key]) !== true) {
            gob[key] = {};
            giveSetter(object[key], newKeys.slice(0), index + 1, self, gob[key]);
        } else {

            Object.defineProperty(gob, key, setterCreators(newKeys.slice(0), self));
            objectOBJ.setObjectValueByNames(self.$_states, newKeys, object[key]);
        }
    }
}

//-------------------------------------------------------


function keyPathToKeys(keyPath) {
    if (Array.isArray(keyPath)) {
        var keys = keyPath;
    } else if (typeTYP.type(keyPath) === "string") {
        var keys = keyPath.split(/[\.\\\/]/);
    } else {
        var keys = [];
        // console.error(`[Gob] keyPathToKeys(${JSON.stringify(keyPath)})`, "invalid keyPath.")
    }
    return keys;
}

/**
 * 创造一个 {set,get} 对象，用于创建属性
 * @param keys 键名列表
 * @returns {{set: *, get: *, value: *}}
 * @private
 */
function setterCreators(keys, self) {
    // var setter = new Function("value", `this.$setValue(${JSON.stringify(keys)} , value )`);
    // var setter = new Function("value", `console.log("set",${JSON.stringify(keys)},this)`);
    // var getter = new Function("value", `console.log("get",${JSON.stringify(keys)},this)`);
    // var getter = new Function(` return this.$getValue(${JSON.stringify(keys)} )`);

    var getter = function (keys, self) {
        // console.info("[creat] get keys", keys,)
        return function () {
            return self.$getValue(keys);
        };
    }(keys, self);

    var setter = function (keys, self) {
        // console.info("[creat] set keys", keys)
        return function (value) {
            self.$setValue(keys, value);
        };
    }(keys, self);

    var ob = {
        set: setter,
        get: getter
    };
    return ob;
}

function setObjectValueByKeys(object, keys, value, preFilters) {
    var nowObject;
    var change = false;

    if (keys.length == 1) {
        var oldValue = object[keys[0]];
        change = checkChange(oldValue, value);
        object[keys[0]] = valuePreFilter(oldValue, value, keys, preFilters);
        return change;
    }

    for (var i = 0; i < keys.length; i++) {

        if (i == 0 && keys.length > 2) {
            if (object[keys[0]] == undefined) {
                object[keys[0]] = {};
            }
            nowObject = object[keys[0]];
        } else if (i < keys.length - 2 && keys.length > 2) {
            if (nowObject[keys[i]] == undefined) {
                nowObject[keys[i]] = {};
            }

            nowObject = nowObject[keys[i]];
        } else if (i == keys.length - 2) {
            if (keys.length === 2) {
                if (object[keys[0]] == undefined) {
                    object[keys[0]] = {};
                }
                nowObject = object[keys[0]];
                var oldValue = nowObject[keys[1]];
                console.log(1.3);
                change = checkChange(oldValue, value);
                nowObject[keys[1]] = valuePreFilter(oldValue, value, keys, preFilters);
                console.log(2);
                return change;
            } else {
                if (nowObject[keys[i]] == undefined) {
                    nowObject[keys[i]] = {};
                }
                nowObject = nowObject[keys[i]];
                var oldValue = nowObject[keys[i + 1]];
                change = checkChange(oldValue, value);
                nowObject[keys[i + 1]] = valuePreFilter(oldValue, value, keys, preFilters);
                return change;
            }
        }
    }
    return change;
}
function checkChange(oldValue, newValue) {
    if (oldValue === newValue) {
        return false;
    } else {
        return { oldValue: oldValue };
    }
}

function valuePreFilter(oldValue, newValue, keys, preFilters) {
    var finValue = newValue;
    if (preFilters != undefined && preFilters.length != undefined) {
        try {
            for (var i = 0; i < preFilters.length; i++) {
                if (typeof preFilters[i].func === "function") {
                    finValue = preFilters[i].func(oldValue, finValue, keys);
                }
            }
        } catch (e) {
            console.error("[Gob] valuePreFilter()", e);
        }
    }
    return finValue;
}

function isAsyncFunction(func) {
    var str = func.toString().trim();
    return !!(str.match(/^async /) || str.match(/return _ref[^\.]*\.apply/));
}

//-----------------------------------------------------------
Gob.prototype.sleep = (() => {
    var _ref4 = _asyncToGenerator(function* (ms) {
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                resolve(ms);
            }, ms);
        });
    });

    return function (_x12) {
        return _ref4.apply(this, arguments);
    };
})();

Gob.prototype.doAsync = _asyncToGenerator(function* () {
    console.log("ssss1");
    var a = yield this.sleep();
    console.log("ssss2", a);
});

return Gob;

})));
