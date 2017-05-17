import _ from 'lodash';

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
    type: function (value)
    {
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
        if (value === null)
        {
            return "null";
        }
        else if (typeof value === "undefined")
        {
            return "undefined";

        } else
        {
            return typeof value === "object" || typeof value === "function" ?
            typeList[typeList.toString.call(value)] || "object" :
                typeof value;
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
    isEmptyObject: function (obj)
    {
        for (var name in obj)
        {
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

    objectCopyToObject: function (ob1, ob2, func_allowCopy, func_rename, func_valueFiter, func_for)
    {

        if(ob2 == undefined)
        {return}
        for (var x in ob1)
        {

            if (func_for != undefined)
            {
                func_for(ob1, ob2, x);
            }

            var _allowCopy = true;
            if (func_allowCopy != undefined)
            {
                _allowCopy = func_allowCopy(x, ob1[x]);
            }


            var name = x;
            if (func_rename != undefined)
            {
                name = func_rename(x, ob1[x]);
            }


            if ( ob1[x]!= undefined && ob1[x].constructor === Object)
            {
                if(typeof ob2[name] !=="object")
                {
                    ob2[name] = {};
                }

                this.objectCopyToObject(ob1[x], ob2[name], func_allowCopy, func_rename, func_valueFiter);
            } else
            {

                if (func_valueFiter != undefined)
                {
                    ob2[name] = func_valueFiter(x, ob1[x]);

                } else
                {

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
    getObjectValueByNames: function (object, names, aheadEndTime)
    {
        var nowValue;
        for (var i = 0; i < (names.length - (aheadEndTime || 0)); i++)
        {
            if (i == 0)
            {
                if (object[names[i]] != undefined)
                {
                    nowValue = object[names[i]];
                } else
                {
                    return null
                }

            } else
            {

                if (nowValue[names[i]] != undefined)
                {
                    nowValue = nowValue[names[i]];
                }
                else
                {
                    return null
                }

            }

        }

        return nowValue
    },


    /**
     * 根据属性名路径列表（names）对对象属性赋值
     * @param object 对象
     * @param names 属性名路径列表，如 [position,enableAssigns,y]
     * @param value 值
     */
    setObjectValueByNames: function (object, names, value)
    {
        var nowObject;

        if (names.length == 1)
        {
            object[names[0]] = value;
            return
        }


        for (var i = 0; i < (names.length); i++)
        {
            if (i == 0 && names.length>2)
            {
                if(object[names[0]] == undefined)
                {
                    object[names[0]] ={};
                }
                nowObject = object[names[0]];
            }
            else if (i < names.length - 2 && names.length>2 )
            {
                if(nowObject[names[i]]== undefined)
                {
                    nowObject[names[i]] ={};
                }

                nowObject = nowObject[names[i]];
            }
            else if (i == names.length - 2)
            {
                if(names.length==2)
                {
                    if(object[names[0]] == undefined)
                    {
                        object[names[0]] ={};
                    }
                    nowObject = object[names[0]];

                    nowObject[names[1]] = value;
                    return

                }
                else{

                    if(nowObject[names[i]]== undefined)
                    {
                        nowObject[names[i]] ={};
                    }

                    nowObject = nowObject[names[i]];
                    nowObject[names[i + 1]] = value;
                    return
                }

            }
        }
    }


};

/**
 * Created by nullice on 2017/5/16.
 */


var GobMode_base_init = function ()
{
    this.$mode = "base";
    this.$addFilter("pre", "type", pre_type, [], 9);
    this.$addFilter("pre", "range", pre_range, [], 10);


};




function pre_range(oldValue, finValue, keys, who, setterReturnInfo)
{
    console.log("f:", keys, finValue);
    var dataRange = Gob.$_getStateModeValueByKeys(keys.concat(["range"]));
    if (dataRange != undefined && dataRange.length != undefined && dataRange.length === 2)
    {
        if (finValue > dataRange[1])
        {
            finValue = dataRange[1];
        }

        if (finValue < dataRange[0])
        {
            finValue = dataRange[0];
        }
    }
    return finValue
}

function pre_type(oldValue, finValue, keys, who, setterReturnInfo)
{
    console.log("f:", keys, finValue);
    var type = this.$_getStateModeValueByKeys(keys.concat(["type"]));
    if (type != undefined)
    {
        var finValueType = typeTYP.type(finValue);
        if (finValueType !== type)
        {
            if (type === "number")
            {
                if (finValueType === "string")
                {
                    var reg = /(-){0,1}[0-9]+/;
                    var re = reg.exec(finValue);
                    if (re != undefined)
                    {
                        var finValue = Number(re[0]);
                        if (finValue !== NaN)
                        {
                            return finValue
                        }

                    }
                }
            } else (type === "striing");
            {
                return "" + finValue
            }

        }


    }

    return oldValue
}

/**
 * Created by nullice on 2017/5/14.
 */


var Gob$1 = function ()
{
    this.$isGob = true;
    /*set 调用次数*/
    this.$_setCount = 0;
    /* 状态改变次数*/
    this.$_changeCount = 0;
    /*状态存储*/
    this.$_states = {};
    /*模式数据存储*/
    this.$_modeData = {};
    /*状态改变记录*/
    this.$enalbeLog = true;
    this.$_log = [];
    /*模式*/
    this.$mode = "normal";
    this.$fitlers = {
        preFilters: {__root: {}},
        finFilters: {__root: {}},
    };


    Object.defineProperty(this, "$fitlers", {enumerable: false});
    Object.defineProperty(this, "$mode", {enumerable: false});
    Object.defineProperty(this, "$isGob", {enumerable: false});
    Object.defineProperty(this, "$_modeData", {enumerable: false});
    Object.defineProperty(this, "$enalbeLog", {enumerable: false});
    Object.defineProperty(this, "$_log", {enumerable: false});
    Object.defineProperty(this, "$_setCount", {enumerable: false});
    Object.defineProperty(this, "$_changeCount", {enumerable: false});
    Object.defineProperty(this, "$_states", {enumerable: false});


    var self = this;
    return this;
};

Gob$1.prototype.$MODES = {BASE: GobMode_base_init};


/**
 * 添加一个过滤器
 * @param fitlerType 过滤器类型，前过滤器： pre, 后过滤器：fin
 * @param filterName 过滤器名称
 * @param filterFunction 过滤函数  newValue preFilter(oldValue, newValue, keys), finFilter(oldValue, newValue, change, keys)
 * @param keyPath 键名路径
 * @param level  执行顺序级别
 * @param isAsync 是否是异步函数
 */
Gob$1.prototype.$addFilter = function (fitlerType, filterName, filterFunction, keyPath, level, isAsync)
{
    if (arguments.length == 1 && typeTYP.type(arguments[0]) === "object")
    {
        try
        {
            var fitlerType = arguments[0].fitlerType;
            var filterName = arguments[0].filterName;
            var filterFunction = arguments[0].filterFunction;
            var keyPath = arguments[0].keyPath;
            var level = arguments[0].level;
            var isAsync = arguments[0].isAsync;

        } catch (e)
        {
            console.error("[Gob] $addFilter invalid arguments:", arguments);
            return
        }
    }

    var keys = keyPathToKeys(keyPath);
    if (fitlerType === "pre")
    {
        var tragetFilters = this.$fitlers.preFilters;
    } else if (fitlerType === "fin")
    {
        var tragetFilters = this.$fitlers.finFilters;
    }

    // console.log("$addFilter", tragetFilters, keys.concat(["__root", filterName]))


    if (typeof  isAsync !== "boolean")
    {
        var isAsync = isAsyncFunction(filterFunction);
    }

    if (level == undefined)
    {
        level = 5;
    }
    objectOBJ.setObjectValueByNames(tragetFilters, keys.concat(["__root", filterName]), {
        filterName: filterName, /*过滤器名*/
        func: filterFunction, /*函数*/
        isAsync: isAsync, /*是否是异步函数*/
        level: level, /*执行顺序级别，值越低越先执行*/
    });
};


/**
 * 移除
 * @param fitlerType
 * @param filterName
 * @param keyPath
 */
Gob$1.prototype.$removeFilter = function (fitlerType, filterName, keyPath)
{
    if (arguments.length == 1 && typeTYP.type(arguments[0]) === "object")
    {
        try
        {
            var fitlerType = arguments[0].fitlerType;
            var filterName = arguments[0].filterName;
            var keyPath = arguments[0].keyPath;

        } catch (e)
        {
            console.error("[Gob] $removeFilter invalid arguments:", arguments);
            return
        }
    }
    var keys = keyPathToKeys(keyPath);
    if (fitlerType === "pre")
    {
        var tragetFilters = this.$fitlers.preFilters;
    } else if (fitlerType === "fin")
    {
        var tragetFilters = this.$fitlers.finFilters;
    }

    var __root = objectOBJ.getObjectValueByNames(tragetFilters, keys.concat(["__root"]));

    if (typeof __root === "object")
    {
        if (__root[filterName] != undefined)
        {
            delete __root[filterName];
        }
    }
};


/**
 * 添加一个前过滤器
 * @param filterName
 * @param filterFunction
 * @param keyPath
 * @param level
 * @param isAsync
 */
Gob$1.prototype.$addPreFilter = function (filterName, filterFunction, keyPath, level, isAsync)
{

    if (arguments.length == 1 && typeTYP.type(arguments[0]) === "object")
    {
        this.$addFilter(arguments[0]);
    } else
    {
        this.$addFilter("pre", filterName, filterFunction, keyPath, level, isAsync);
    }
};


/**
 * 添加一个最终过滤器
 * @param filterName 过滤器名
 * @param filterFunction 过滤器函数
 * @param keyPath
 * @param level
 * @param isAsync
 */
Gob$1.prototype.$addFinFilter = function (filterName, filterFunction, keyPath, level, isAsync)
{

    if (arguments.length == 1 && typeTYP.type(arguments[0]) === "object")
    {
        this.$addFilter(arguments[0]);
    } else
    {
        this.$addFilter("fin", filterName, filterFunction, keyPath, level, isAsync);
    }
};


/**
 * 根据键名列表获取匹配的过滤器列表
 * @param fitlerType
 * @param keys
 * @returns {{hasAsync: boolean, filters: Array}}
 */
Gob$1.prototype.$_getFilterByKeys = function (fitlerType, keys)
{
    var keys = keys.slice(0);
    if (fitlerType === "pre")
    {
        var tragetFilters = this.$fitlers.preFilters;
    } else if (fitlerType === "fin")
    {
        var tragetFilters = this.$fitlers.finFilters;
    }
    var filters = [];
    var hasAsync = false;
    for (var i = 0; i < keys.length + 1; i++)
    {
        var oncefilters = [];
        var onceKeys = keys.slice(0, keys.length - i);
        // console.info("scan filter:", onceKeys.concat(["__root"]))
        var filtersOb = objectOBJ.getObjectValueByNames(tragetFilters, onceKeys.concat(["__root"]));
        for (var x in filtersOb)
        {
            if (filtersOb[x].isAsync)
            {
                hasAsync = true;
            }
            oncefilters.push(filtersOb[x]);
        }
        oncefilters.sort(function (a, b)
        {
            var result = b.level - a.level;
            if (result === 0)
            {
                var nameA = a.filterName.toUpperCase();
                var nameB = b.filterName.toUpperCase();
                if (nameA < nameB)
                {
                    return -1;
                }
                if (nameA > nameB)
                {
                    return 1;
                }
            }
            return result;
        });

        filters = oncefilters.concat(filters);
    }

    return {hasAsync: hasAsync, filters: filters}
};


/**
 * 执行一个赋值命令
 * @param setInfo {keyPath, value,onlySet}
 * @returns {*}
 */
Gob$1.prototype.$execSet = async function (setInfo)
{
    if (setInfo != undefined && setInfo.keyPath != undefined)
    {
        var keys = keyPathToKeys(setInfo.keyPath);

        if (setInfo.onlySet)
        {
            var onlySet = setInfo.onlySet;
        } else
        {
            var onlySet = false;
        }
        await this.$setValue(keys, setInfo.value, onlySet);
    }
};

/**
 * 执行一个取值命令
 * @param keyPath
 */
Gob$1.prototype.$execGet = function (keyPath)
{
    if (keyPath)
    {
        var keys = keyPathToKeys(keyPath);
        return this.$getValue(keys)
    }
};

/**
 * 执行一个指令或指令集
 * @param Order
 */
Gob$1.prototype.$exec = function (order)
{
    if (typeTYP.type(order) === "array")
    {
        var orders = order;
    } else
    {
        var orders = [order];
    }

    for (var i = 0; i < orders.length; i++)
    {
        if (orders[i] != undefined && orders[i].order != undefined)
        {
            if (typeTYP.type(orders[i].info) === "string")
            {
                try
                {
                    var info = JSON.parse(orders[i].info);
                } catch (e)
                {
                    console.error("[Gob] $exec ", orders[i], e);
                    continue;
                }
            } else
            {
                var info = orders[i].info;
            }

            if (orders[i].order === "new")
            {
                this.$newStates(keyPathToKeys(info.keyPath), info.value);
            } else if (orders[i].order === "set")
            {
                this.$execSet(info);
            }
        }
    }
};


/**
 * 根据键名列表获取键值
 * @param keys 键名列表
 * @returns {Promise.<*>}
 */
Gob$1.prototype.$getValue = function (keys)
{
    // console.log("$getValue", keys, value)
    var value = objectOBJ.getObjectValueByNames(this.$_states, keys);
    return value
};


/**
 * 根据键名列表设置键值
 * @param keys 键名列表
 * @param value 键值
 * @param onlySet 仅设置值，不触发 fin 过滤器
 * @returns {Promise.<void>}
 */
Gob$1.prototype.$setValue = async function (keys, value, who, onlySet)
{
    var setterReturnInfo = {};
    // console.log("$setValue", keys, value)
    //0. 计数
    this.$_setCount++;


    // 1. 获取匹配的 preFilter 前过滤器
    var filtersOb = this.$_getFilterByKeys("pre", keys);
    // console.log("$setValue filtersOb", keys, filtersOb)
    // console.log("hasAsync keys", keys, filtersOb.hasAsync)


    // 2. 改变状态
    if (filtersOb.hasAsync)
    {
        var change = await setObjectValueByKeysAsync(this.$_states, keys, value, filtersOb.filters, setterReturnInfo, this, who);
    } else
    {
        var change = setObjectValueByKeys(this.$_states, keys, value, filtersOb.filters, setterReturnInfo, this, who);
    }

    // var change =   OBJ.setObjectValueByNames(this.$_states, keys, value)

    if (change.change === true)
    {
        this.$_changeCount++;
    }
    if (this.$enalbeLog)/*记录*/
    {
        this.$_log.push({order: "set", who: who, info: {keyPath: keys, value: _.cloneDeep(value)}});
    }

    if (onlySet)
    {
        return;
    }

    // 3.获取匹配的 finFilter 最终过滤器
    var finFiltersOb = this.$_getFilterByKeys("fin", keys);

    if (finFiltersOb.hasAsync)
    {
        for (var i = 0; i < finFiltersOb.filters.length; i++)
        {
            if (typeof  finFiltersOb.filters[0].func === "function")
            {
                await  finFiltersOb.filters[0].func, call(this, change.oldValue, change.newValue, change.change, keys, who, setterReturnInfo);
            }
        }
    } else
    {
        for (var i = 0; i < finFiltersOb.filters.length; i++)
        {
            if (typeof  finFiltersOb.filters[0].func === "function")
            {
                finFiltersOb.filters[0].func.call(this, change.oldValue, change.newValue, change.change, keys, who, setterReturnInfo);
            }
        }
    }

    return setterReturnInfo

};

/**
 * 添加新状态
 * $newStates({a:{b:100}}) 或 $newStates(["a","b"],100)
 * @param object
 * @param value
 */
Gob$1.prototype.$newStates = function (object, value, who)
{
    if (this.$mode !== "normal" && this.$mode != undefined)
    {
        console.log("$_applyModeState(object)", object);

        var ob = createModeStates(object);
        this.$_modeData = ob.modeData;
        object = ob.states;
    }


    if (typeTYP.type(object) === "array" && arguments.length >= 2)
    {
        var object = keyPathToObject(object, value);
        var thisWho = who;
    } else
    {
        var thisWho = value;
    }

    var self = this;
    giveSetter(object, [], 0, self, this, thisWho);
};


/**
 * 把 ModeState 状态模型数据应用到实例上
 * @param object
 */
Gob$1.prototype.$_applyModeState = function (object)
{
    var ob = createModeStates(object);
    this.$newStates(ob.states);
    this.$_modeData = ob.modeData;

};

Gob$1.prototype.$_getStateModeValueByKeys = function (keys)
{
    return objectOBJ.getObjectValueByNames(this.$_modeData, keys)
};

Gob$1.prototype.$use = function (initFunc)
{
    initFunc.apply(this);
};


/*-------------------------*/
/**
 *
 * @param object
 * @param keys
 * @param index
 * @param self
 */
function giveSetter(object, keys, index, self, gob, who)
{
    for (var key in object)
    {
        var newKeys = keys.concat(key);
        var isObject = false;
        if (object[key] != undefined)
        {
            isObject = (typeTYP.type(object[key]) === "object");
        }
        if (isObject && objectOBJ.isEmptyObject(object[key]) !== true)
        {
            if (typeof  gob[key] !== "object")
            {
                gob[key] = {};
            }

            giveSetter(object[key], newKeys.slice(0), index + 1, self, gob[key], who);
        } else
        {

            Object.defineProperty(gob, key, setterCreators(newKeys.slice(0), self));
            objectOBJ.setObjectValueByNames(self.$_states, newKeys, object[key]);
            if (self.$enalbeLog)/*记录*/
            {
                this.$_log.push({order: "new", who: who, info: {keyPath: newKeys, value: _.cloneDeep(object[key])}});

            }
        }

    }
}


//-------------------------------------------------------


function keyPathToKeys(keyPath)
{
    if (Array.isArray(keyPath))
    {
        var keys = keyPath;
    } else if (typeTYP.type(keyPath) === "string")
    {
        var keys = keyPath.split(/[\.\\\/]/);
    }
    else
    {
        var keys = [];
        // console.error(`[Gob] keyPathToKeys(${JSON.stringify(keyPath)})`, "invalid keyPath.")
    }
    return keys
}


/**
 * 创造一个 {set,get} 对象，用于创建属性
 * @param keys 键名列表
 * @returns {{set: *, get: *, value: *}}
 * @private
 */
function setterCreators(keys, self)
{
    // var setter = new Function("value", `this.$setValue(${JSON.stringify(keys)} , value )`);
    // var setter = new Function("value", `console.log("set",${JSON.stringify(keys)},this)`);
    // var getter = new Function("value", `console.log("get",${JSON.stringify(keys)},this)`);
    // var getter = new Function(` return this.$getValue(${JSON.stringify(keys)} )`);

    var getter = (function (keys, self)
    {
        // console.info("[creat] get keys", keys,)
        return function ()
        {
            return self.$getValue(keys)
        }
    })(keys, self);

    var setter = (function (keys, self)
    {
        // console.info("[creat] set keys", keys)
        return function (value)
        {
            self.$setValue(keys, value);
        }
    })(keys, self);


    var ob = {
        set: setter,
        get: getter,
        enumerable: true,
    };
    return ob;
}


/**
 * 根据键名列表给对象成员设置值
 * 返回 false 则值未改变，如值改变可通过返回对象获取旧值{oldValue: oldValue}
 * @param object
 * @param keys
 * @param value
 * @returns {boolean}
 */
async function setObjectValueByKeysAsync(object, keys, value, preFilters, setterReturnInfo, self, who)
{
    var nowObject;
    var change = false;

    if (keys.length == 1)
    {
        var oldValue = object[keys[0]];
        value = await valuePreFilterAsync(oldValue, value, keys, preFilters, setterReturnInfo, self, who);
        change = checkChange(oldValue, value);
        object[keys[0]] = value;
        return change
    }

    for (var i = 0; i < (keys.length); i++)
    {

        if (i == 0 && keys.length > 2)
        {
            if (object[keys[0]] == undefined)
            {
                object[keys[0]] = {};
            }
            nowObject = object[keys[0]];
        }
        else if (i < keys.length - 2 && keys.length > 2)
        {
            if (nowObject[keys[i]] == undefined)
            {
                nowObject[keys[i]] = {};
            }

            nowObject = nowObject[keys[i]];
        }
        else if (i == keys.length - 2)
        {
            if (keys.length === 2)
            {
                if (object[keys[0]] == undefined)
                {
                    object[keys[0]] = {};
                }
                nowObject = object[keys[0]];
                var oldValue = nowObject[keys[1]];
                value = await valuePreFilterAsync(oldValue, value, keys, preFilters, setterReturnInfo, self, who);
                change = checkChange(oldValue, value);
                nowObject[keys[1]] = value;
                return change

            }
            else
            {
                if (nowObject[keys[i]] == undefined)
                {
                    nowObject[keys[i]] = {};
                }
                nowObject = nowObject[keys[i]];
                var oldValue = nowObject[keys[i + 1]];
                value = await valuePreFilterAsync(oldValue, value, keys, preFilters, setterReturnInfo, self, who);
                change = checkChange(oldValue, value);
                nowObject[keys[i + 1]] = value;
                return change
            }

        }
    }
    return change
}

function setObjectValueByKeys(object, keys, value, preFilters, setterReturnInfo, self, who)
{
    var nowObject;
    var change = false;

    if (keys.length == 1)
    {
        var oldValue = object[keys[0]];
        value = valuePreFilter(oldValue, value, keys, preFilters, setterReturnInfo, self, who);
        change = checkChange(oldValue, value);
        object[keys[0]] = value;
        return change
    }

    for (var i = 0; i < (keys.length); i++)
    {

        if (i == 0 && keys.length > 2)
        {
            if (object[keys[0]] == undefined)
            {
                object[keys[0]] = {};
            }
            nowObject = object[keys[0]];
        }
        else if (i < keys.length - 2 && keys.length > 2)
        {
            if (nowObject[keys[i]] == undefined)
            {
                nowObject[keys[i]] = {};
            }

            nowObject = nowObject[keys[i]];
        }
        else if (i == keys.length - 2)
        {
            if (keys.length === 2)
            {
                if (object[keys[0]] == undefined)
                {
                    object[keys[0]] = {};
                }
                nowObject = object[keys[0]];
                var oldValue = nowObject[keys[1]];
                value = valuePreFilter(oldValue, value, keys, preFilters, setterReturnInfo, self, who);
                change = checkChange(oldValue, value);
                nowObject[keys[1]] = value;
                return change
            }
            else
            {
                if (nowObject[keys[i]] == undefined)
                {
                    nowObject[keys[i]] = {};
                }
                nowObject = nowObject[keys[i]];
                var oldValue = nowObject[keys[i + 1]];
                value = valuePreFilter(oldValue, value, keys, preFilters, setterReturnInfo, self, who);
                change = checkChange(oldValue, value);
                nowObject[keys[i + 1]] = value;
                return change
            }
        }
    }
    return change
}
function checkChange(oldValue, newValue)
{
    if (oldValue === newValue)
    {
        return {change: false, oldValue: oldValue, newValue: newValue}
    } else
    {
        return {change: true, oldValue: oldValue, newValue: newValue}
    }
}
async function valuePreFilterAsync(oldValue, newValue, keys, preFilters, setterReturnInfo, self, who)
{
    var finValue = newValue;
    // console.log("finValue", finValue)
    if (preFilters != undefined && preFilters.length != undefined)
    {
        try
        {
            for (var i = 0; i < preFilters.length; i++)
            {
                if (typeof preFilters[i].func === "function")
                {
                    finValue = await preFilters[i].func.call(self, oldValue, finValue, keys, who, setterReturnInfo);
                }
            }
        } catch (e)
        {
            console.error("[Gob] valuePreFilterAsync()", e);
        }
    }
    return finValue
}
function valuePreFilter(oldValue, newValue, keys, preFilters, setterReturnInfo, self, who)
{
    var finValue = newValue;
    if (preFilters != undefined && preFilters.length != undefined)
    {
        try
        {
            for (var i = 0; i < preFilters.length; i++)
            {
                if (typeof preFilters[i].func === "function")
                {
                    finValue = preFilters[i].func.call(self, oldValue, finValue, keys, who, setterReturnInfo);
                }

            }
        } catch (e)
        {
            console.error("[Gob] valuePreFilter()", e);
        }
    }
    return finValue
}

function keyPathToObject(keyPath, value)
{

    var keys = keyPathToKeys(keyPath);
    var ob = {};
    var iter = ob;
    for (var i = 0; i < keys.length; i++)
    {
        if (i < keys.length - 1)
        {
            iter[keys[i]] = {};
            iter = iter[keys[i]];
        } else
        {
            iter[keys[i]] = value;
        }
    }
    return ob
}

function isAsyncFunction(func)
{
    var str = func.toString().trim();
    return !!(
        str.match(/^async /) ||
        str.match(/return _ref[^\.]*\.apply/)
    );
}


function createModeStates(data)
{
    var states = {};
    var modeData = data;

    var itr = states;
    sacn(data);


    return {states: states, modeData: modeData}
    function sacn(object)
    {
        var hasNotObject = true;
        var baseItr = itr;
        for (var x in object)
        {
            itr = baseItr;
            if (typeof object[x] === "object" && !Array.isArray(object[x]))
            {
                hasNotObject = false;

                itr[x] = {};
                var itItr = itr;
                itr = itr[x];

                var isDefineObject = sacn(object[x]);
                if (isDefineObject)
                {
                    if (object[x].default != undefined)
                    {
                        itItr[x] = object[x].default;
                    } else
                    {
                        itItr[x] = null;
                    }
                    itr = itItr;
                }
            } else
            {
                itr[x] = object[x];
            }
        }
        return hasNotObject
    }
}


//-----------------------------------------------------------
Gob$1.prototype.sleep = async function (ms)
{
    return new Promise(function (resolve, reject)
    {
        setTimeout(() =>
        {
            resolve(ms);
        }, ms);
    })
};

Gob$1.prototype.doAsync = async function ()
{
    console.log("ssss1");
    var a = await  this.sleep();
    console.log("ssss2", a);
};


var propertySetting = {writable: false, enumerable: false};

Object.defineProperty(Gob$1.prototype, "$newStates", propertySetting);
Object.defineProperty(Gob$1.prototype, "$setValue", propertySetting);
Object.defineProperty(Gob$1.prototype, "$getValue", propertySetting);
Object.defineProperty(Gob$1.prototype, "$exec", propertySetting);
Object.defineProperty(Gob$1.prototype, "$execSet", propertySetting);
Object.defineProperty(Gob$1.prototype, "$execGet", propertySetting);
Object.defineProperty(Gob$1.prototype, "$_getFilterByKeys", propertySetting);
Object.defineProperty(Gob$1.prototype, "$addFilter", propertySetting);
Object.defineProperty(Gob$1.prototype, "$addFilter", propertySetting);
Object.defineProperty(Gob$1.prototype, "$removeFilter", propertySetting);
Object.defineProperty(Gob$1.prototype, "$addFinFilter", propertySetting);
Object.defineProperty(Gob$1.prototype, "$addPreFilter", propertySetting);
Object.defineProperty(Gob$1.prototype, "doAsync", propertySetting);
Object.defineProperty(Gob$1.prototype, "sleep", propertySetting);
Object.defineProperty(Gob$1.prototype, "$modes", propertySetting);

export default Gob$1;
