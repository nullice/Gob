function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/*
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
//             · Object ·
//
//       By nullice ui@nullice.com
//             nullice.com
//            license: MIT

/**
 * 对象操作相关操作
 * @type {{isEmptyObject: ObjectOBJ.isEmptyObject, objectCopyToObject: ObjectOBJ.objectCopyToObject, getObjectValueByNames: ObjectOBJ.getObjectValueByNames, setObjectValueByNames: ObjectOBJ.setObjectValueByNames, treeFind: ObjectOBJ.treeFind, treeEach: function(Object[], Function, string, boolean): {struct: Array, deep: number, total: number}, pathEach(Object, Function): void}}
 */
var ObjectOBJ = {

    /**
     * 对象是否为空
     * @param obj
     * @returns {boolean}
     */
    isEmptyObject: function isEmptyObject(obj) {
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

    objectCopyToObject: function objectCopyToObject(ob1, ob2, func_allowCopy, func_rename, func_valueFiter, func_for) {

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
                if (_typeof$1(ob2[name]) !== "object") {
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
    getObjectValueByNames: function getObjectValueByNames(object, names, aheadEndTime) {
        var nowValue;
        for (var i = 0; i < names.length - (aheadEndTime || 0); i++) {
            if (i == 0) {
                if (object[names[i]] != undefined) {
                    nowValue = object[names[i]];
                } else {
                    return undefined;
                }
            } else {

                if (nowValue[names[i]] != undefined) {
                    nowValue = nowValue[names[i]];
                } else {
                    return undefined;
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
    setObjectValueByNames: function setObjectValueByNames(object, names, value) {
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
    },

    /**
     * 在由对象数组组成的树中查找对象。如果查找全部结果会以数组返回，否则直接返回找到的对象。
     *
     * tree =
     * [
     *   {id: 1, children: [{id: 4}]},
     *   {id: 2},
     * ]
     * findTree (tree, 4, "children", false, false) => {id: 4}
     *
     * @param {object[]} objectArr 对象数组组成的树
     * @param {function} match 匹配器 -  如果是字符串则是匹配对象下的 id 键，也可提供一个匹配函数，匹配函数通过参数接收遍历到的对象，返回是否匹配的 boolen (ob)={retrun ob.name=="xxx">}
     * @param {string} childrenKey 子树键名 - 通过这个名字在对象中找子树
     * @param {boolean} findAll 是否查找全部
     * @param {boolean} depthFirst 深度优先 - 默认是广度优先
     * @return {array|null}
     */
    treeFind: function treeFind(objectArr, match, childrenKey, findAll, depthFirst) {

        if (typeof match == "function") {
            // 使用输入的匹配 function
            var matchFunc = match;
        } else {
            var matchFunc = function matchFunc(ob) {
                return ob.id == match;
            };
        }

        function once(objectArr, match, childrenKey, findAll, depthFirst) {
            var reslut = [];
            var children = [];
            for (var i = 0; i < objectArr.length; i++) {
                var item = objectArr[i];

                if (matchFunc(item)) {
                    reslut.push(item);
                    if (!findAll) {
                        return reslut;
                    }
                }

                if (item[childrenKey]) {
                    if (depthFirst) {
                        var re = once(item[childrenKey], match, childrenKey, findAll, depthFirst);
                        if (!findAll && re.length > 0) {
                            return re;
                        }
                        reslut = reslut.concat(re);
                    } else {
                        children.push(item[childrenKey]);
                    }
                }
            }

            if (!depthFirst) {
                for (var i = 0; i < children.length; i++) {
                    var re = once(children[i], match, childrenKey, findAll, depthFirst);
                    if (!findAll && re.length > 0) {
                        return re;
                    }
                    reslut = reslut.concat(re);
                }
            }

            return reslut;
        }

        var re = once(objectArr, matchFunc, childrenKey, findAll, depthFirst);
        if (!findAll) {
            return re.length > 0 ? re[0] : null;
        } else {
            return re;
        }
    },

    /**
     * 在由对象数组组成的树中遍历处理树的每个节点。
     *
     * 处理函数：
     * eachFunc(单个对象, 遍历深度, 当层深度节点计数, 总节点计数, 当前子树, 当前子树位置)
     * 在 eachFunc 中 return true 可以提前终止遍历。
     * 当前子树[当前子树位置+1] 可获取下一个节点。
     * 返回树的信息：
     * {
     *      struct:[4,2,5], // 每层节点数
     *      deep:3,         // 树深度
     *      total: 11       // 总节点数
     * }
     *
     * @param {object[]} objectArr 对象数组组成的树
     * @param {function} eachFunc 处理函数
     * @param {string} childrenKey 子树键名 - 通过这个名字在对象中找子树
     * @param {boolean} depthFirst 深度优先 - 默认是广度优先
     * @return {{struct: Array, deep: number, total: number}}
     */
    treeEach: function treeEach(objectArr, eachFunc, childrenKey, depthFirst) {
        var deepLengths = [];
        var count = 0;
        var deepAll = 0;

        if (!eachFunc) {
            eachFunc = function eachFunc(o) {};
        }

        once(objectArr, eachFunc, childrenKey, depthFirst, 0);
        return { struct: deepLengths, deep: deepAll + 1, total: count };

        function once(objectArr, eachFunc, childrenKey, depthFirst, deep) {
            if (deep > deepAll) {
                deepAll = deep;
            }

            var children = [];
            for (var i = 0; i < objectArr.length; i++) {
                count++;
                if (deepLengths[deep] == undefined) {
                    deepLengths[deep] = 1;
                } else {
                    deepLengths[deep]++;
                }

                var item = objectArr[i];
                if (eachFunc(item, deep, deepLengths[deep], count, objectArr, i)) {
                    return;
                }

                if (item[childrenKey]) {
                    if (depthFirst) {
                        var re = once(item[childrenKey], eachFunc, childrenKey, depthFirst, deep + 1);
                        if (re) {
                            return;
                        }
                    } else {
                        children.push(item[childrenKey]);
                    }
                }
            }

            if (!depthFirst) {
                for (var i = 0; i < children.length; i++) {
                    var re = once(children[i], eachFunc, childrenKey, depthFirst, deep + 1);
                    if (re) {
                        return;
                    }
                }
            }
            return;
        }
    },

    /**
     * 遍历对象每一个元素，可以获取对象键名组成的 path  (["c","d","e"])
     *
     * 处理函数：
     * eachFunc(当前元素, 当前 path, 当层深度 )
     *
     * pathEach( {
     *  b:111,
     *  c:{d:{e:222}}
     * })
     *
     * @param {object} object
     * @param {function} eachFunc 处理函数
     * @param {boolean|function} [checkCycle] 是否检查循环引用，为 true 会跳过循环引用，还可以提供一个函数 checkCycleCallback(target, path, cyclePath) 来处理一些事
     */
    pathEach: function pathEach(object, eachFunc, checkCycle) {

        if (checkCycle) {
            var useCycleCallback = typeof checkCycle === "function";
            var cycleCache = new WeakMap();

            cycleCache.set(object, useCycleCallback ? [] : true);
        }

        _each(object, [], 0);

        function _each(object) {
            var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var deep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            for (var key in object) {
                var item = object[key];

                // 检查循环引用
                if (checkCycle && (typeof item === "undefined" ? "undefined" : _typeof$1(item)) === "object") {
                    var nowPath = [].concat(toConsumableArray(path), [key]);

                    if (cycleCache.get(item)) {
                        if (useCycleCallback) {
                            checkCycle(item, nowPath, cycleCache.get(item));
                        }
                        continue; // >_< 忽略循环引用
                    } else {
                        if (useCycleCallback) {
                            cycleCache.set(item, nowPath);
                        } else {
                            cycleCache.set(item, true);
                        }
                    }
                }

                var nowPath = [].concat(toConsumableArray(path), [key]);
                eachFunc(item, nowPath, deep);

                if ((typeof item === "undefined" ? "undefined" : _typeof$1(item)) === "object") {
                    _each(item, nowPath, deep + 1);
                }
            }
        }
    }
};

/*
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
//              · Type ·
//
//       By nullice ui@nullice.com
//             nullice.com
//            license: MIT

/**
 * 类型相关模块
 * @type {{getType: TypeTYP.getType}}
 */
var TypeTYP = {

    /**
     * 得到指定值的数据类型。返回数据类型名称字符串，如 "boolean","object","string" 。
     * @param value
     * @returns {*}
     */
    getType: function getType(value) {
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
            return (typeof value === "undefined" ? "undefined" : _typeof$1(value)) === "object" || typeof value === "function" ? typeList[typeList.toString.call(value)] || "object" : typeof value === "undefined" ? "undefined" : _typeof$1(value);
        }
    }

    /**
     * @exports TypeTYP
     */
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var rngBrowser = createCommonjsModule(function (module) {
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && msCrypto.getRandomValues.bind(msCrypto));
if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}
});

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

var utils = createCommonjsModule(function (module, exports) {

var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    var obj;

    while (queue.length) {
        var item = queue.pop();
        obj = item.obj[item.prop];

        if (Array.isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }

    return obj;
};

exports.arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

exports.merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = exports.arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = exports.merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = exports.merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

exports.assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

exports.decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function encode(str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

exports.compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    return compactQueue(queue);
};

exports.isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

exports.isBuffer = function isBuffer(obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};
});
var utils_1 = utils.arrayToObject;
var utils_2 = utils.merge;
var utils_3 = utils.assign;
var utils_4 = utils.decode;
var utils_5 = utils.encode;
var utils_6 = utils.compact;
var utils_7 = utils.isRegExp;
var utils_8 = utils.isBuffer;

var toISO = Date.prototype.toISOString;

var defaults$1 = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var defaults$2 = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
};

var GATE_PROXY_NAME = "[PROXY]";
/**
 * 创建一个基于 path 的代理处理器
 * @param loaclData
 * @param {string[]} loaclpath
 * @param {string[]} fullPath
 * @param {{gobCore: GobCore; GOB_CORE_NAME: string}} state
 * @returns {{set: (target: any, key: any, value: any) => boolean; get: (target: any, property: any) => (any)}}
 */

function giveHandler(loaclData, localGate, fullPath, state) {
  return {
    "set": function set(target, key, value) {
      // 处理特殊属性 [Gob Core]
      if (key == state.GOB_CORE_NAME) {
        return true;
      }

      var nowFullPath = _toConsumableArray(fullPath).concat([key]);

      console.log("[set]", "fullPath:", nowFullPath, {
        key: key,
        target: target,
        value: value
      }); // 根据值属性处理写入值

      var valueType = TypeTYP.getType(value);

      if (valueType === "object") {
        /**
         * 在这个 Handler 的 localData 上根据 localPath 设置 Gate
         * @param {object} localData
         * @param {string[]} targetPath
         * @param {string[]} fullPath
         * @returns {any}
         */
        var creatGate = function creatGate(localData, targetPath, fullPath) {
          console.log("  [creatGate] key:", key, "fullPath", nowFullPath, {
            targetPath: targetPath,
            localGate: localGate
          });
          var gate = {};
          var proxy = new Proxy(localData, giveHandler(localData, gate, fullPath, state));
          gate[GATE_PROXY_NAME] = proxy;
          ObjectOBJ.setObjectValueByNames(localGate, targetPath, gate);
          return gate;
        };

        // 写入值到 data
        // rcObject.setObjectValueByNames(loaclData, nowLocalPath, value)
        loaclData[key] = value; // 创建 gate

        creatGate(value, [key], nowFullPath); // 遍历值来创建 gate

        ObjectOBJ.pathEach(value, function (item, path) {
          if (_typeof(item) === "object") {
            creatGate(item, [key].concat(_toConsumableArray(path)), _toConsumableArray(nowFullPath).concat(_toConsumableArray(path)));
          }
        }, function (object, path, cyclePath) {
          console.log("  [cycle]", object, path, cyclePath);
          var cycleObject;

          if (cyclePath.length == 0) {
            cycleObject = localGate[key];
          } else {
            cycleObject = ObjectOBJ.getObjectValueByNames(localGate, [key, cyclePath], null);
          }

          console.log("  [cycle cycleObject]", cycleObject);
          ObjectOBJ.setObjectValueByNames(localGate, [key].concat(_toConsumableArray(path)), cycleObject);
        });
      } else {
        loaclData[key] = value;
      }

      return true;
    },
    "get": function get(target, key) {
      // 处理特殊属性 [Gob Core]
      if (key == state.GOB_CORE_NAME) {
        return state.gobCore;
      }

      var nowLocalPath = [key];

      var nowFullPath = _toConsumableArray(fullPath).concat([key]); // 获取原始值
      // let value = rcObject.getObjectValueByNames(loaclData, [key], null)


      var value = loaclData[key];
      console.log("[get]", nowFullPath, {
        loaclData: loaclData,
        nowLocalPath: nowLocalPath,
        key: key,
        target: target
      }); // 根据值属性处理读出值

      var valueType = TypeTYP.getType(value);
      console.log("  [get value]", value, valueType);

      if (valueType === "object") {
        console.log("  [find gates]", nowFullPath, {
          key: key,
          nowLocalPath: nowLocalPath,
          localGate: localGate
        });
        var gate = localGate[key];
        return gate[GATE_PROXY_NAME];
      } else {
        console.log("  return value", value);
        return value;
      }
    }
  };
}

var GOB_CORE_NAME = "[Gob Core]";
var GobCore = function GobCore() {
  _classCallCheck(this, GobCore);

  this.isGob = 3;
  this.data = {};
  this.gate = {};
};

function GobFactory(object) {
  var gobCore = new GobCore();
  var proxy = new Proxy(gobCore.data, giveHandler(gobCore.data, gobCore.gate, [], {
    coreData: gobCore.data,
    coreGate: gobCore.gate,
    gobCore: gobCore,
    GOB_CORE_NAME: GOB_CORE_NAME
  }));
  proxy[GOB_CORE_NAME] = gobCore;

  if (object) {
    for (var key in object) {
      proxy[key] = object[key];
    }
  }

  return proxy;
}
/**
 * 注册一些方法和常量到 Gob
 */


Object.assign(GobFactory, {
  KEY: GOB_CORE_NAME,
  GOB_CORE_NAME: GOB_CORE_NAME,

  /**
   * 检查一个 gob 实例的 Core
   * @param gob
   * @returns {any}
   */
  inspect: function inspect(gob) {
    var core = gob[GOB_CORE_NAME];

    if (core) {
      return gob[GOB_CORE_NAME];
    } else {
      throw Error("Gob.inspect: param is not Gob3 Instance");
    }
  }
});
 //# sourceMappingURL=index.js.map

export default GobFactory;
