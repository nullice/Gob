/**
 * Created by nullice on 2017/5/14.
 */


import  TYP from "./lib/Richang_JSEX/typeTYP.js"
import  OBJ from "./lib/Richang_JSEX/objectOBJ.js"
import  GobMode_base from "./modes/GobMode-base.js"

var Gob = function ()
{
    this.$isGob = true;
    /*set 调用次数*/
    this.$_setCount = 0;
    /* 状态改变次数*/
    this.$_changeCount = 0;
    /*状态存储*/
    this.$_states = {};
    /*模式数据存储*/
    this.$_modeData = {}
    /*状态改变记录*/
    this.$enalbeLog = true
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


    var self = this
    return this;
}

Gob.prototype.$MODES = {BASE: GobMode_base};


/**
 * 添加一个过滤器
 * @param fitlerType 过滤器类型，前过滤器： pre, 后过滤器：fin
 * @param filterName 过滤器名称
 * @param filterFunction 过滤函数  newValue preFilter(oldValue, newValue, keys), finFilter(oldValue, newValue, change, keys)
 * @param keyPath 键名路径
 * @param level  执行顺序级别
 * @param isAsync 是否是异步函数
 */
Gob.prototype.$addFilter = function (fitlerType, filterName, filterFunction, keyPath, level, isAsync)
{
    if (arguments.length == 1 && TYP.type(arguments[0]) === "object")
    {
        try
        {
            var fitlerType = arguments[0].fitlerType
            var filterName = arguments[0].filterName
            var filterFunction = arguments[0].filterFunction
            var keyPath = arguments[0].keyPath
            var level = arguments[0].level
            var isAsync = arguments[0].isAsync

        } catch (e)
        {
            console.error("[Gob] $addFilter invalid arguments:", arguments)
            return
        }
    }

    var keys = keyPathToKeys(keyPath)
    if (fitlerType === "pre")
    {
        var tragetFilters = this.$fitlers.preFilters
    } else if (fitlerType === "fin")
    {
        var tragetFilters = this.$fitlers.finFilters
    }

    // console.log("$addFilter", tragetFilters, keys.concat(["__root", filterName]))


    if (typeof  isAsync !== "boolean")
    {
        var isAsync = isAsyncFunction(filterFunction)
    }

    if (level == undefined)
    {
        level = 5
    }
    OBJ.setObjectValueByNames(tragetFilters, keys.concat(["__root", filterName]), {
        filterName: filterName, /*过滤器名*/
        func: filterFunction, /*函数*/
        isAsync: isAsync, /*是否是异步函数*/
        level: level, /*执行顺序级别，值越低越先执行*/
    })
}


/**
 * 移除
 * @param fitlerType
 * @param filterName
 * @param keyPath
 */
Gob.prototype.$removeFilter = function (fitlerType, filterName, keyPath)
{
    if (arguments.length == 1 && TYP.type(arguments[0]) === "object")
    {
        try
        {
            var fitlerType = arguments[0].fitlerType
            var filterName = arguments[0].filterName
            var keyPath = arguments[0].keyPath

        } catch (e)
        {
            console.error("[Gob] $removeFilter invalid arguments:", arguments)
            return
        }
    }
    var keys = keyPathToKeys(keyPath)
    if (fitlerType === "pre")
    {
        var tragetFilters = this.$fitlers.preFilters
    } else if (fitlerType === "fin")
    {
        var tragetFilters = this.$fitlers.finFilters
    }

    var __root = OBJ.getObjectValueByNames(tragetFilters, keys.concat(["__root"]))

    if (typeof __root === "object")
    {
        if (__root[filterName] != undefined)
        {
            delete __root[filterName]
        }
    }
}


/**
 * 添加一个前过滤器
 * @param filterName
 * @param filterFunction
 * @param keyPath
 * @param level
 * @param isAsync
 */
Gob.prototype.$addPreFilter = function (filterName, filterFunction, keyPath, level, isAsync)
{

    if (arguments.length == 1 && TYP.type(arguments[0]) === "object")
    {
        this.$addFilter(arguments[0])
    } else
    {
        this.$addFilter("pre", filterName, filterFunction, keyPath, level, isAsync)
    }
}


/**
 * 添加一个最终过滤器
 * @param filterName 过滤器名
 * @param filterFunction 过滤器函数
 * @param keyPath
 * @param level
 * @param isAsync
 */
Gob.prototype.$addFinFilter = function (filterName, filterFunction, keyPath, level, isAsync)
{

    if (arguments.length == 1 && TYP.type(arguments[0]) === "object")
    {
        this.$addFilter(arguments[0])
    } else
    {
        this.$addFilter("fin", filterName, filterFunction, keyPath, level, isAsync)
    }
}


/**
 * 根据键名列表获取匹配的过滤器列表
 * @param fitlerType
 * @param keys
 * @returns {{hasAsync: boolean, filters: Array}}
 */
Gob.prototype.$_getFilterByKeys = function (fitlerType, keys)
{
    var keys = keys.slice(0)
    if (fitlerType === "pre")
    {
        var tragetFilters = this.$fitlers.preFilters
    } else if (fitlerType === "fin")
    {
        var tragetFilters = this.$fitlers.finFilters
    }
    var filters = []
    var hasAsync = false;
    for (var i = 0; i < keys.length + 1; i++)
    {
        var oncefilters = []
        var onceKeys = keys.slice(0, keys.length - i)
        // console.info("scan filter:", onceKeys.concat(["__root"]))
        var filtersOb = OBJ.getObjectValueByNames(tragetFilters, onceKeys.concat(["__root"]))
        for (var x in filtersOb)
        {
            if (filtersOb[x].isAsync)
            {
                hasAsync = true
            }
            oncefilters.push(filtersOb[x])
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
        })

        filters = oncefilters.concat(filters)
    }

    return {hasAsync: hasAsync, filters: filters}
}


/**
 * 执行一个赋值命令
 * @param setInfo {keyPath, value,onlySet}
 * @returns {*}
 */
Gob.prototype.$execSet = async function (setInfo)
{
    if (setInfo != undefined && setInfo.keyPath != undefined)
    {
        var keys = keyPathToKeys(setInfo.keyPath)

        if (setInfo.onlySet)
        {
            var onlySet = setInfo.onlySet
        } else
        {
            var onlySet = false
        }
        await this.$setValue(keys, setInfo.value, onlySet)
    }
}

/**
 * 执行一个取值命令
 * @param keyPath
 */
Gob.prototype.$execGet = function (keyPath)
{
    if (keyPath)
    {
        var keys = keyPathToKeys(keyPath)
        return this.$getValue(keys)
    }
}

/**
 * 执行一个指令或指令集
 * @param Order
 */
Gob.prototype.$exec = function (order)
{
    if (TYP.type(order) === "array")
    {
        var orders = order
    } else
    {
        var orders = [order]
    }

    for (var i = 0; i < orders.length; i++)
    {
        if (orders[i] != undefined && orders[i].order != undefined)
        {
            if (TYP.type(orders[i].info) === "string")
            {
                try
                {
                    var info = JSON.parse(orders[i].info)
                } catch (e)
                {
                    console.error("[Gob] $exec ", orders[i], e)
                    continue;
                }
            } else
            {
                var info = orders[i].info
            }

            if (orders[i].order === "new")
            {
                this.$newStates(keyPathToKeys(info.keyPath), info.value)
            } else if (orders[i].order === "set")
            {
                this.$execSet(info)
            }
        }
    }
}


/**
 * 根据键名列表获取键值
 * @param keys 键名列表
 * @returns {Promise.<*>}
 */
Gob.prototype.$getValue = function (keys)
{
    // console.log("$getValue", keys, value)
    var value = OBJ.getObjectValueByNames(this.$_states, keys);
    return value
}


/**
 * 根据键名列表设置键值
 * @param keys 键名列表
 * @param value 键值
 * @param onlySet 仅设置值，不触发 fin 过滤器
 * @returns {Promise.<void>}
 */
Gob.prototype.$setValue = async function (keys, value, onlySet)
{
    var setterReturnInfo = {}
    // console.log("$setValue", keys, value)
    //0. 计数
    this.$_setCount++;


    // 1. 获取匹配的 preFilter 前过滤器
    var filtersOb = this.$_getFilterByKeys("pre", keys)
    // console.log("$setValue filtersOb", keys, filtersOb)
    // console.log("hasAsync keys", keys, filtersOb.hasAsync)


    // 2. 改变状态
    if (filtersOb.hasAsync)
    {
        var change = await setObjectValueByKeysAsync(this.$_states, keys, value, filtersOb.filters, setterReturnInfo, this)
    } else
    {
        var change = setObjectValueByKeys(this.$_states, keys, value, filtersOb.filters, setterReturnInfo, this)
    }

    // var change =   OBJ.setObjectValueByNames(this.$_states, keys, value)

    if (change.change === true)
    {
        this.$_changeCount++;
    }
    if (this.$enalbeLog)/*记录*/
    {
        this.$_log.push({order: "set", info: JSON.stringify({keyPath: keys, value: value})})
    }

    if (onlySet)
    {
        return;
    }

    // 3.获取匹配的 finFilter 最终过滤器
    var finFiltersOb = this.$_getFilterByKeys("fin", keys)

    if (finFiltersOb.hasAsync)
    {
        for (var i = 0; i < finFiltersOb.filters.length; i++)
        {
            if (typeof  finFiltersOb.filters[0].func === "function")
            {
                await  finFiltersOb.filters[0].func, call(this, change.oldValue, change.newValue, change.change, keys, setterReturnInfo)
            }
        }
    } else
    {
        for (var i = 0; i < finFiltersOb.filters.length; i++)
        {
            if (typeof  finFiltersOb.filters[0].func === "function")
            {
                finFiltersOb.filters[0].func.call(this, change.oldValue, change.newValue, change.change, keys, setterReturnInfo)
            }
        }
    }

    return setterReturnInfo

}

/**
 * 添加新状态
 * $newStates({a:{b:100}}) 或 $newStates(["a","b"],100)
 * @param object
 * @param value
 */
Gob.prototype.$newStates = function (object, value)
{
    if (this.$mode !== "normal" && this.$mode != undefined)
    {
        console.log("$_applyModeState(object)", object)

        var ob = createModeStates(object)
        this.$_modeData = ob.modeData
        object = ob.states
    }


    if (TYP.type(object) === "array" && arguments.length === 2)
    {
        var object = keyPathToObject(object, value)
    }

    var self = this
    giveSetter(object, [], 0, self, this)
}


/**
 * 把 ModeState 状态模型数据应用到实例上
 * @param object
 */
Gob.prototype.$_applyModeState = function (object)
{
    var ob = createModeStates(object)
    this.$newStates(ob.states)
    this.$_modeData = ob.modeData

}

Gob.prototype.$_getStateModeValueByKeys = function (keys)
{
    return OBJ.getObjectValueByNames(this.$_modeData, keys)
}

Gob.prototype.$use = function (initFunc)
{
    initFunc.apply(this)
}


/*-------------------------*/
/**
 *
 * @param object
 * @param keys
 * @param index
 * @param self
 */
function giveSetter(object, keys, index, self, gob)
{
    for (var key in object)
    {
        var newKeys = keys.concat(key)
        var isObject = false
        if (object[key] != undefined)
        {
            isObject = (TYP.type(object[key]) === "object")
        }
        if (isObject && OBJ.isEmptyObject(object[key]) !== true)
        {
            if (typeof  gob[key] !== "object")
            {
                gob[key] = {}
            }

            giveSetter(object[key], newKeys.slice(0), index + 1, self, gob[key])
        } else
        {

            Object.defineProperty(gob, key, setterCreators(newKeys.slice(0), self));
            OBJ.setObjectValueByNames(self.$_states, newKeys, object[key])
            if (self.$enalbeLog)/*记录*/
            {
                self.$_log.push({order: "new", info: JSON.stringify({keyPath: newKeys, value: object[key]})})
            }
        }

    }
}


//-------------------------------------------------------


function keyPathToKeys(keyPath)
{
    if (Array.isArray(keyPath))
    {
        var keys = keyPath
    } else if (TYP.type(keyPath) === "string")
    {
        var keys = keyPath.split(/[\.\\\/]/);
    }
    else
    {
        var keys = []
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
    })(keys, self)

    var setter = (function (keys, self)
    {
        // console.info("[creat] set keys", keys)
        return function (value)
        {
            self.$setValue(keys, value)
        }
    })(keys, self)


    var ob = {
        set: setter,
        get: getter,
        enumerable: true,
    }
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
async function setObjectValueByKeysAsync(object, keys, value, preFilters, setterReturnInfo, self)
{
    var nowObject;
    var change = false;

    if (keys.length == 1)
    {
        var oldValue = object[keys[0]]
        value = await valuePreFilterAsync(oldValue, value, keys, preFilters, setterReturnInfo, self);
        change = checkChange(oldValue, value)
        object[keys[0]] = value
        return change
    }

    for (var i = 0; i < (keys.length); i++)
    {

        if (i == 0 && keys.length > 2)
        {
            if (object[keys[0]] == undefined)
            {
                object[keys[0]] = {}
            }
            nowObject = object[keys[0]];
        }
        else if (i < keys.length - 2 && keys.length > 2)
        {
            if (nowObject[keys[i]] == undefined)
            {
                nowObject[keys[i]] = {}
            }

            nowObject = nowObject[keys[i]];
        }
        else if (i == keys.length - 2)
        {
            if (keys.length === 2)
            {
                if (object[keys[0]] == undefined)
                {
                    object[keys[0]] = {}
                }
                nowObject = object[keys[0]];
                var oldValue = nowObject[keys[1]]
                value = await valuePreFilterAsync(oldValue, value, keys, preFilters, setterReturnInfo, self);
                change = checkChange(oldValue, value)
                nowObject[keys[1]] = value
                return change

            }
            else
            {
                if (nowObject[keys[i]] == undefined)
                {
                    nowObject[keys[i]] = {}
                }
                nowObject = nowObject[keys[i]];
                var oldValue = nowObject[keys[i + 1]]
                value = await valuePreFilterAsync(oldValue, value, keys, preFilters, setterReturnInfo, self);
                change = checkChange(oldValue, value)
                nowObject[keys[i + 1]] = value
                return change
            }

        }
    }
    return change
}

function setObjectValueByKeys(object, keys, value, preFilters, setterReturnInfo, self)
{
    var nowObject;
    var change = false;

    if (keys.length == 1)
    {
        var oldValue = object[keys[0]]
        value = valuePreFilter(oldValue, value, keys, preFilters, setterReturnInfo, self);
        change = checkChange(oldValue, value)
        object[keys[0]] = value
        return change
    }

    for (var i = 0; i < (keys.length); i++)
    {

        if (i == 0 && keys.length > 2)
        {
            if (object[keys[0]] == undefined)
            {
                object[keys[0]] = {}
            }
            nowObject = object[keys[0]];
        }
        else if (i < keys.length - 2 && keys.length > 2)
        {
            if (nowObject[keys[i]] == undefined)
            {
                nowObject[keys[i]] = {}
            }

            nowObject = nowObject[keys[i]];
        }
        else if (i == keys.length - 2)
        {
            if (keys.length === 2)
            {
                if (object[keys[0]] == undefined)
                {
                    object[keys[0]] = {}
                }
                nowObject = object[keys[0]];
                var oldValue = nowObject[keys[1]]
                value = valuePreFilter(oldValue, value, keys, preFilters, setterReturnInfo, self);
                change = checkChange(oldValue, value)
                nowObject[keys[1]] = value
                return change
            }
            else
            {
                if (nowObject[keys[i]] == undefined)
                {
                    nowObject[keys[i]] = {}
                }
                nowObject = nowObject[keys[i]];
                var oldValue = nowObject[keys[i + 1]]
                value = valuePreFilter(oldValue, value, keys, preFilters, setterReturnInfo, self);
                change = checkChange(oldValue, value)
                nowObject[keys[i + 1]] = value
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
async function valuePreFilterAsync(oldValue, newValue, keys, preFilters, setterReturnInfo, self)
{
    var finValue = newValue
    // console.log("finValue", finValue)
    if (preFilters != undefined && preFilters.length != undefined)
    {
        try
        {
            for (var i = 0; i < preFilters.length; i++)
            {
                if (typeof preFilters[i].func === "function")
                {
                    finValue = await preFilters[i].func.call(self, oldValue, finValue, keys, setterReturnInfo)
                }
            }
        } catch (e)
        {
            console.error("[Gob] valuePreFilterAsync()", e)
        }
    }
    return finValue
}
function valuePreFilter(oldValue, newValue, keys, preFilters, setterReturnInfo, self)
{
    var finValue = newValue
    if (preFilters != undefined && preFilters.length != undefined)
    {
        try
        {
            for (var i = 0; i < preFilters.length; i++)
            {
                if (typeof preFilters[i].func === "function")
                {
                    finValue = preFilters[i].func.call(self, oldValue, finValue, keys, setterReturnInfo)
                }

            }
        } catch (e)
        {
            console.error("[Gob] valuePreFilter()", e)
        }
    }
    return finValue
}

function keyPathToObject(keyPath, value)
{

    var keys = keyPathToKeys(keyPath)
    var ob = {}
    var iter = ob
    for (var i = 0; i < keys.length; i++)
    {
        if (i < keys.length - 1)
        {
            iter[keys[i]] = {}
            iter = iter[keys[i]]
        } else
        {
            iter[keys[i]] = value
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
    var states = {}
    var modeData = data

    var itr = states
    sacn(data)


    return {states: states, modeData: modeData}
    function sacn(object)
    {
        var hasNotObject = true
        var baseItr = itr
        for (var x in object)
        {
            itr = baseItr
            if (typeof object[x] === "object" && !Array.isArray(object[x]))
            {
                hasNotObject = false

                itr[x] = {}
                var itItr = itr
                itr = itr[x]

                var isDefineObject = sacn(object[x])
                if (isDefineObject)
                {
                    if (object[x].default != undefined)
                    {
                        itItr[x] = object[x].default
                    } else
                    {
                        itItr[x] = null
                    }
                    itr = itItr
                }
            } else
            {
                itr[x] = object[x]
            }
        }
        return hasNotObject
    }
}


//-----------------------------------------------------------
Gob.prototype.sleep = async function (ms)
{
    return new Promise(function (resolve, reject)
    {
        setTimeout(() =>
        {
            resolve(ms)
        }, ms)
    })
}

Gob.prototype.doAsync = async function ()
{
    console.log("ssss1")
    var a = await  this.sleep();
    console.log("ssss2", a)
}


var propertySetting = {writable: false, enumerable: false}

Object.defineProperty(Gob.prototype, "$newStates", propertySetting);
Object.defineProperty(Gob.prototype, "$setValue", propertySetting);
Object.defineProperty(Gob.prototype, "$getValue", propertySetting);
Object.defineProperty(Gob.prototype, "$exec", propertySetting);
Object.defineProperty(Gob.prototype, "$execSet", propertySetting);
Object.defineProperty(Gob.prototype, "$execGet", propertySetting);
Object.defineProperty(Gob.prototype, "$_getFilterByKeys", propertySetting);
Object.defineProperty(Gob.prototype, "$addFilter", propertySetting);
Object.defineProperty(Gob.prototype, "$addFilter", propertySetting);
Object.defineProperty(Gob.prototype, "$removeFilter", propertySetting);
Object.defineProperty(Gob.prototype, "$addFinFilter", propertySetting);
Object.defineProperty(Gob.prototype, "$addPreFilter", propertySetting);
Object.defineProperty(Gob.prototype, "doAsync", propertySetting);
Object.defineProperty(Gob.prototype, "sleep", propertySetting);
Object.defineProperty(Gob.prototype, "$modes", propertySetting);


export default  Gob;






