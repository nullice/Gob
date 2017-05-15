/**
 * Created by nullice on 2017/5/14.
 */


import  TYP from "./lib/Richang_JSEX/typeTYP.js"
import  OBJ from "./lib/Richang_JSEX/objectOBJ.js"

var Gob = function ()
{
    this.$isGob = true;
    this.$_setCount = 0;
    /*set 调用次数*/
    this.$_changeCount = 0;
    /* 状态改变次数*/
    this.$_states = {};
    this.$fitlers = {
        preFilters: {__root: {}},
        finFilters: {__root: {}},
    };


    var self = this
    // this.$addFilter("pre", "aysnc1", async function (oldValue, newValue, keys)
    // {
    //     await  self.sleep(2000)
    //     console.log(22222)
    //     return "[22222]"
    // }, [])


    return this;
}


/**
 * 添加一个过滤器
 * @param fitlerType 过滤器类型，前过滤器： pre, 后过滤器：fin
 * @param filterName 过滤器名称
 * @param filterFunction 过滤函数  newValue filter(oldValue, newValue, keys)
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

    console.log("$addFilter", tragetFilters, keys.concat(["__root", filterName]))


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
        console.info("scan filter:", onceKeys.concat(["__root"]))
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
 * 根据键名列表获取键值
 * @param keys
 * @returns {Promise.<*>}
 */
Gob.prototype.$getValue = function (keys)
{
    console.log("$getValue", keys, value)
    var value = OBJ.getObjectValueByNames(this.$_states, keys);
    return value
}


Gob.prototype.$setValue = async function (keys, value, onlySet)
{
    console.log("$setValue", keys, value)
    //0. 计数
    this.$_setCount++;


    // 1. preFilter
    var filtersOb = this.$_getFilterByKeys("pre", keys)
    console.log("$setValue filtersOb", keys, filtersOb)

    console.log("hasAsync keys", keys, filtersOb.hasAsync)
    if (filtersOb.hasAsync)
    {
        var change = await setObjectValueByKeysAsync(this.$_states, keys, value, filtersOb.filters)
    } else
    {
        var change = setObjectValueByKeys(this.$_states, keys, value, filtersOb.filters)
    }

    // var change =   OBJ.setObjectValueByNames(this.$_states, keys, value)

    if (change === false)
    {

    } else
    {
        this.$_changeCount++;
    }


    if (onlySet)
    {
        return;
    }
}

Gob.prototype.$newStates = function (object)
{
    var self = this
    giveSetter(object, [], 0, self, this)
}
Object.defineProperty(Gob.prototype, "$newStates", {writable: false});


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
            gob[key] = {}
            giveSetter(object[key], newKeys.slice(0), index + 1, self, gob[key])
        } else
        {

            Object.defineProperty(gob, key, setterCreators(newKeys.slice(0), self));
            OBJ.setObjectValueByNames(self.$_states, newKeys, object[key])
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
async function setObjectValueByKeysAsync(object, keys, value, preFilters)
{
    var nowObject;
    var change = false;

    if (keys.length == 1)
    {
        var oldValue = object[keys[0]]
        change = checkChange(oldValue, value)
        object[keys[0]] = await valuePreFilterAsync(oldValue, value, keys, preFilters);
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
                console.log(1.3)
                change = checkChange(oldValue, value)
                nowObject[keys[1]] = await valuePreFilterAsync(oldValue, value, keys, preFilters);
                console.log(2)
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
                change = checkChange(oldValue, value)
                nowObject[keys[i + 1]] = await valuePreFilterAsync(oldValue, value, keys, preFilters);
                return change
            }

        }
    }
    return change
}

function setObjectValueByKeys(object, keys, value, preFilters)
{
    var nowObject;
    var change = false;

    if (keys.length == 1)
    {
        var oldValue = object[keys[0]]
        change = checkChange(oldValue, value)
        object[keys[0]] = valuePreFilter(oldValue, value, keys, preFilters);
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
                console.log(1.3)
                change = checkChange(oldValue, value)
                nowObject[keys[1]] = valuePreFilter(oldValue, value, keys, preFilters);
                console.log(2)
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
                change = checkChange(oldValue, value)
                nowObject[keys[i + 1]] = valuePreFilter(oldValue, value, keys, preFilters);
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
        return false
    } else
    {
        return {oldValue: oldValue}
    }
}
async function valuePreFilterAsync(oldValue, newValue, keys, preFilters)
{
    var finValue = newValue
    console.log("finValue", finValue)
    if (preFilters != undefined && preFilters.length != undefined)
    {
        try
        {
            for (var i = 0; i < preFilters.length; i++)
            {
                if (typeof preFilters[i].func === "function")
                {
                    finValue = await preFilters[i].func(oldValue, finValue, keys)
                }

            }
        } catch (e)
        {
            console.error("[Gob] valuePreFilterAsync()", e)
        }
    }
    return finValue
}
function valuePreFilter(oldValue, newValue, keys, preFilters)
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
                    finValue = preFilters[i].func(oldValue, finValue, keys)
                }

            }
        } catch (e)
        {
            console.error("[Gob] valuePreFilter()", e)
        }
    }
    return finValue
}


function isAsyncFunction(func)
{
    var str = func.toString().trim();
    return !!(
        str.match(/^async /) ||
        str.match(/return _ref[^\.]*\.apply/)
    );
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


//测试 ----------------------
// async function doAsync()
// {
//     return new Promise(function (resolve, reject)
//     {
//         setTimeout(() =>
//         {
//             console.log("sleep 2s");
//             resolve(444)
//         }, 2000)
//     })
// }
//
// window.sleep = async function (ms)
// {
//     return new Promise(function (resolve, reject)
//     {
//         setTimeout(() =>
//         {
//             resolve()
//         }, ms)
//     })
// }
// async function asyncTask()
// {
//
//     console.log("ssss1")
//     var a = await  doAsync();
//     console.log("ssss2" + a)
//     return 2016
// }
//
// var __result = asyncTask()
// console.log("sss_end" + __result)
export default  Gob;
