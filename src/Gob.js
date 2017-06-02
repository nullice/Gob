/**
 * Created by nullice on 2017/5/14.
 */


import  TYP from "./lib/Richang_JSEX/typeTYP.js"
import  OBJ from "./lib/Richang_JSEX/objectOBJ.js"
import  GobMode_Base from "./modes/GobMode-Base.js"
import  GobMode_VueSupport from "./modes/GobMode-VueSupport.js"
const _clonedeep = require("./../node_modules/lodash.clonedeep")

var Gob = function (initalStates)
{
    this.$isGob = true;

    /*内部属性与方法容器*/
    if (this.$_entrails === undefined)
    {
        this.$_entrails = {};
    }


    this.$_entrails.count = {
        set: 0,   //set 调用次数
        change: 0   //状态改变次数
    }
    this.$_entrails.states = {}          //状态存储对象
    this.$_entrails.modeData = {}        //模式数据存储对象
    this.$_entrails.setting = {}         //可供过滤器自由存放普通属性的对象
    this.$_entrails.enalbeRec = false    //启用状态改变动作录制
    this.$_entrails.recs = []             //存储录制的状态改变动作
    this.$_entrails.lastKeyPath = null;  //最后一次使用的 KetPath
    this.$_entrails.mode = "normal";      //当前模式
    this.$_entrails.fitlers = {
        preFilters: {__root: {}},
        finFilters: {__root: {}},
    };
    this.$_entrails.hooks = {            // hook
        newState: null,
        OVERWRITE_newStateObject: null,
        OVERWRITE_deleteState: null,
    }
    this.$log = {
        enableLog: false,                 // 启用状态改变记录
        list: []                           // 改变指令记录列表
    }


    // 设置属性不可枚举
    Object.defineProperty(this, "$_entrails", {enumerable: false});
    Object.defineProperty(this, "$log", {enumerable: false});


    // 构造函数
    if (typeof  initalStates === "object")
    {
        this.$newStates(initalStates)
    }
    var self = this
    return this;
}

Gob.prototype.$MODES = {BASE: GobMode_Base, VUE_SUPPORT: GobMode_VueSupport};
Gob.prototype.$util = {
    getObjectValueByKeys: getObjectValueByKeys,
    deleteObjectValueByKeys: deleteObjectValueByKeys
}
// Object.defineProperty(Gob.prototype, "$util", {enumerable: false});
// Gob.$util = Gob.prototype.$util

/**
 * 根据键名列表获取匹配的过滤器列表
 * @param fitlerType
 * @param keys
 * @returns {{hasAsync: boolean, filters: Array}}
 */
Gob.prototype.$getFilterByKeys = function (fitlerType, keys)
{
    var keys = keys.slice(0)
    if (fitlerType === "pre")
    {
        var tragetFilters = this.$_entrails.fitlers.preFilters
    } else if (fitlerType === "fin")
    {
        var tragetFilters = this.$_entrails.fitlers.finFilters
    }
    var filters = []
    var hasAsync = false;
    for (var i = 0; i < keys.length + 1; i++)
    {
        var oncefilters = []
        var onceKeys = keys.slice(0, keys.length - i)
        // console.info("scan filter:", onceKeys.concat(["__root"]))
        var filtersOb = getObjectValueByKeys(tragetFilters, onceKeys.concat(["__root"]))
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
        var tragetFilters = this.$_entrails.fitlers.preFilters
    } else if (fitlerType === "fin")
    {
        var tragetFilters = this.$_entrails.fitlers.finFilters
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
 * 移除一个过滤器
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
        var tragetFilters = this.$_entrails.fitlers.preFilters
    } else if (fitlerType === "fin")
    {
        var tragetFilters = this.$_entrails.fitlers.finFilters
    }

    var __root = getObjectValueByKeys(tragetFilters, keys.concat(["__root"]))

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
 * 执行一个指令或一个指令列表
 * @param Order
 */
Gob.prototype.$exec = async function (order)
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

            if (orders[i].order === "new")
            {
                this.$newStates(keyPathToKeys(orders[i].keyPath), orders[i].value, orders[i].who)
            }
            else if (orders[i].order === "delete")
            {
                this.$deleteState(orders[i].keyPath, orders[i].who)
            }
            else if (orders[i].order === "set")
            {
                await this.$setValue(orders[i].keyPath, orders[i].value, orders[i].who)
            }
            else if (orders[i].order === "update")
            {
                this.$updateValue(orders[i].keyPath, orders[i].value, orders[i].who)
            }
        }
    }
}


/**
 * 根据键名列表获取键值
 * @param keys 键名列表
 * @returns {Promise.<*>}
 */
Gob.prototype.$getValue = function (keyPath)
{
    // console.log("$getValue", keyPath)
    var keys = keyPathToKeys(keyPath)
    this.$_entrails.lastKeyPath = keys
    return getObjectValueByKeys(this.$_entrails.states, keys);
}


/**
 * 根据键名列表设置键值
 * @param keys 键名列表
 * @param value 键值
 * @returns {Promise.<void>}
 */
Gob.prototype.$setValue = async function (keyPath, value, who)
{
    var keys = keyPathToKeys(keyPath)
    this.$_entrails.lastKeyPath = keys  //记录 keyPath
    // console.log("$setValue", keys, value)


    if (TYP.type(value) === "object" && who != "Gob")
    {
        var ob = {};
        ob[arrayLast(keys)] = value
        this.$deleteState(keys)


        var tragetOb = getObjectValueByKeys(this, keys, 1)
        keys.pop()
        giveSetter(ob, keys, 0, this, tragetOb, "Gob")
        return
    }


    var filterRope = {}   //过滤器间额外信息通信管道

    //0. 计数
    this.$_entrails.count.set++;

    /*logs 记录指令 */
    if (this.$log.enableLog || this.$_entrails.enalbeRec)
    {
        var order = {order: "set", who: who, keyPath: keys, value: _clonedeep(value)}
        if (this.$log.enableLog) this.$log.list.push(order);
        if (this.$_entrails.enalbeRec) this.$_entrails.recs.push(order);
    }


    // 1. 获取匹配的 preFilter 前过滤器
    var filtersOb = this.$getFilterByKeys("pre", keys)
    // console.log("$setValue filtersOb", keys, filtersOb)
    // console.log("hasAsync keys", keys, filtersOb.hasAsync)

    // 2. 改变状态
    if (filtersOb.hasAsync)
    {
        var change = await setObjectValueByKeysAsync(this.$_entrails.states, keys, value, filtersOb.filters, filterRope, this, who)
    } else
    {
        var change = setObjectValueByKeys(this.$_entrails.states, keys, value, filtersOb.filters, filterRope, this, who)
    }

    //3. 记录 setting 指令
    if (change.change === true)
    {
        this.$_entrails.count.change++;
    }

    // 3. finFilter 最终过滤器
    var finFiltersOb = this.$getFilterByKeys("fin", keys)

    if (finFiltersOb.hasAsync)
    {
        for (var i = 0; i < finFiltersOb.filters.length; i++)
        {
            if (typeof  finFiltersOb.filters[0].func === "function")
            {
                await  finFiltersOb.filters[0].func.call(this, change.oldValue, change.newValue, change.change, keys, who, filterRope)
            }
        }
    } else
    {
        for (var i = 0; i < finFiltersOb.filters.length; i++)
        {
            if (typeof  finFiltersOb.filters[0].func === "function")
            {
                finFiltersOb.filters[0].func.call(this, change.oldValue, change.newValue, change.change, keys, who, filterRope)
            }
        }
    }


    return {order: "update", who: who, keyPath: keys, value: change.newValue}
}


/**
 * 根据键名列表直接更新值，不触发过滤器
 * @param keyPath
 * @param value
 * @param who
 */
Gob.prototype.$updateValue = function (keyPath, value, who)
{
    var keys = keyPathToKeys(keyPath)
    this.$_entrails.lastKeyPath = keys
    var change = setObjectValueByKeys(this.$_entrails.states, keys, value, [], {}, this, who)
}


/**
 * 删除一个状态
 * @param keyPath
 * @param who
 */
Gob.prototype.$deleteState = function (keyPath, who)
{
    var keys = keyPathToKeys(keyPath)
    this.$_entrails.lastKeyPath = keys

    if (typeof  this.$_entrails.hooks.OVERWRITE_deleteState === "function")
    {
        deleteObjectValueByKeys(this, keys, 0, this.$_entrails.hooks.OVERWRITE_deleteState)
    } else
    {
        deleteObjectValueByKeys(this, keys, 0)
    }
    deleteObjectValueByKeys(this.$_entrails.states, keys, 0)

    if (this.$log.enableLog || this.$_entrails.enalbeRec)
    {
        var order = {order: "delete", who: who, keyPath: keys}
        if (this.$log.enableLog) this.$log.list.push(order);
        if (this.$_entrails.enalbeRec) this.$_entrails.recs.push(order);
    }

}

/**
 * 添加新状态
 * $newStates({a:{b:100}}) 或 $newStates(["a","b"],100)
 * @param object
 * @param value
 */
Gob.prototype.$newStates = function (object, value, who)
{

    if (TYP.type(object) !== "object" && arguments.length >= 2)
    {
        var keys = keyPathToKeys(object)
        // object = this.$util.getObjectValueByKeys(object, keys, 1)
        // if (object == undefined)
        // {
        //     console.log("object==undefined")
        //     object = this
        // }
        // if (TYP.type(value) === "object")
        // {
        //     var newValue = {}
        //     newValue[arrayLast(keys)] = value
        //     var value = newValue
        // }

        object = keyPathToObject(keys, value)
        var thisWho = who
    } else
    {
        var thisWho = value
    }

    if (this.$_entrails.mode !== "normal" && this.$_entrails.mode != undefined)
    {
        console.log("$util.applyModeState(object)", object)

        var ob = createModeStates(object)
        this.$_entrails.modeData = ob.modeData
        var object = ob.states
    }


    var self = this
    giveSetter(object, [], 0, self, this, thisWho)
}


/**
 * 获取一个含有有 Gob 的语句的 KeyPath
 * @param GobExpression
 * @returns {null}
 */
Gob.prototype.$getKeyPath = function (GobExpression)
{
    return this.$_entrails.lastKeyPath
}


/**
 * 开始一个记录
 */
Gob.prototype.$rec = function ()
{

    this.$_entrails.recs = []
    this.$_entrails.enalbeRec = true
}


Gob.prototype.$recEnd = function ()
{
    var logs = this.$_entrails.recs
    this.$_entrails.enalbeRec = false
    this.$_entrails.recs = []
    return logs
}


/**
 * 把 ModeState 模式的状态数据应用到实例上
 * @param object
 */
Gob.prototype.$util.applyModeState = function (object)
{
    var ob = createModeStates(object)
    this.$newStates(ob.states)
    this.$_entrails.modeData = ob.modeData

}

/**
 * 根据 keys 获取获取 Gob 实例中的 ModeState
 * @param keys
 * @returns {*}
 */
Gob.prototype.$getModeStateValueByKeys = function (keys)
{
    return getObjectValueByKeys(this.$_entrails.modeData, keys)
}


/**
 * 应用一个模式或者插件
 * @param initFunc
 */
Gob.prototype.$use = function (initFunc)
{

    if (typeof initFunc === "function")
    {
        initFunc.apply(this)
    }
    else if (typeof initFunc === "object")
    {
        if (typeof initFunc.init === "function")
        {
            initFunc.init.apply(this)
        }
    }
}


/*-------------------------*/
/**
 * 给状态添加 setter 、getter
 * @param object
 * @param keys
 * @param index
 * @param self
 */
function giveSetter(object, keys, index, self, itr, who)
{
    for (var key in object)
    {
        var newKeys = keys.concat(key)
        var isObject = false


        // console.log("typeof  self.$_entrails.hooks.OVERWRITE_newStateObject ",typeof  self.$_entrails.hooks.OVERWRITE_newStateObject )
        if (typeof  self.$_entrails.hooks.OVERWRITE_newStateObject === "function")
        {
            self.$_entrails.hooks.OVERWRITE_newStateObject(itr, key, {}, keys)
        }


        if (object[key] != undefined)
        {
            isObject = (TYP.type(object[key]) === "object")

        }

        if (isObject && OBJ.isEmptyObject(object[key]) !== true)
        {
            if (typeof  itr[key] !== "object")
            {
                itr[key] = {}
            }

            giveSetter(object[key], newKeys.slice(0), index + 1, self, itr[key], who)
        } else
        {

            // console.log("defineProperty", key, itr)
            Object.defineProperty(itr, key, setterCreators(newKeys.slice(0), self));
            if (typeof  self.$_entrails.hooks.newState === "function")
            {
                self.$_entrails.hooks.newState(itr, key, object[key], keys)
            }


            OBJ.setObjectValueByNames(self.$_entrails.states, newKeys, object[key])
            if (self.$log.enableLog || self.$_entrails.enalbeRec)/*记录*/
            {
                var order = {order: "new", who: who, keyPath: newKeys, value: _clonedeep(object[key])}
                if (self.$log.enableLog) self.$log.list.push(order);
                if (self.$_entrails.enalbeRec) self.$_entrails.recs.push(order);

            }

        }

    }
}
0

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
        configurable: true
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
async function setObjectValueByKeysAsync(object, keys, value, preFilters, filterRope, self, who)
{
    var nowObject;
    var change = false;

    if (keys.length == 1)
    {
        var oldValue = object[keys[0]]
        value = await valuePreFilterAsync(oldValue, value, keys, preFilters, filterRope, self, who);
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
                value = await valuePreFilterAsync(oldValue, value, keys, preFilters, filterRope, self, who);
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
                value = await valuePreFilterAsync(oldValue, value, keys, preFilters, filterRope, self, who);
                change = checkChange(oldValue, value)
                nowObject[keys[i + 1]] = value
                return change
            }

        }
    }
    return change
}

function setObjectValueByKeys(object, keys, value, preFilters, filterRope, self, who)
{
    var nowObject;
    var change = false;

    if (keys.length == 1)
    {
        var oldValue = object[keys[0]]
        value = valuePreFilter(oldValue, value, keys, preFilters, filterRope, self, who);
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
                value = valuePreFilter(oldValue, value, keys, preFilters, filterRope, self, who);
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
                value = valuePreFilter(oldValue, value, keys, preFilters, filterRope, self, who);
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
async function valuePreFilterAsync(oldValue, newValue, keys, preFilters, filterRope, self, who)
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
                    finValue = await preFilters[i].func.call(self, oldValue, finValue, keys, who, filterRope)
                }
            }
        } catch (e)
        {
            console.error("[Gob] valuePreFilterAsync()", e)
        }
    }
    return finValue
}
function valuePreFilter(oldValue, newValue, keys, preFilters, filterRope, self, who)
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
                    finValue = preFilters[i].func.call(self, oldValue, finValue, keys, who, filterRope)
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


function arrayLast(array, len)
{
    if (len == undefined) len = 0;
    if (len >= array.length) len = array.length - 1;

    return array[array.length - len - 1]
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

function getObjectValueByKeys(object, keys, aheadEndTime)
{

    var itr = object
    var finTime = (keys.length - (aheadEndTime || 0))

    if (finTime === 0)
    {
        return itr
    }

    for (var i = 0; i < finTime; i++)
    {
        if (i === finTime - 1)
        {
            return itr[keys[i]]
        }

        if (itr[keys[i]] != undefined)
        {
            itr = itr[keys[i]];
        }
        else
        {
            return null
        }

    }
}

function deleteObjectValueByKeys(object, keys, aheadEndTime, deleteFunc)
{

    var itr = object
    var finTime = (keys.length - (aheadEndTime || 0))


    if (typeof  deleteFunc === "function")
    {
        var useDeleteFunc = true
    }
    for (var i = 0; i < finTime; i++)
    {
        if (i === finTime - 1)
        {
            if (useDeleteFunc)
            {
                deleteFunc(itr, keys[i])
            } else
            {
                delete itr[keys[i]]
            }
        }

        if (itr[keys[i]] != undefined)
        {
            itr = itr[keys[i]];
        }
        else
        {
            return null
        }

    }
}

//-----------------------------------------------------------


Gob.prototype.$util.sleep = async function (ms)
{
    return new Promise(function (resolve, reject)
    {
        setTimeout(() =>
        {
            resolve(ms)
        }, ms)
    })
}

Gob.prototype.$util.testAsync = async function ()
{
    console.log("step1")
    var a = await  this.sleep();
    console.log("step2", a)
}


var propertySetting = {enumerable: false}

Object.defineProperty(Gob.prototype, "$newStates", propertySetting);
Object.defineProperty(Gob.prototype, "$setValue", propertySetting);
Object.defineProperty(Gob.prototype, "$getValue", propertySetting);
Object.defineProperty(Gob.prototype, "$exec", propertySetting);
Object.defineProperty(Gob.prototype, "$execSet", propertySetting);
Object.defineProperty(Gob.prototype, "$execGet", propertySetting);

Object.defineProperty(Gob.prototype, "$addFilter", propertySetting);
Object.defineProperty(Gob.prototype, "$removeFilter", propertySetting);
Object.defineProperty(Gob.prototype, "$addFinFilter", propertySetting);
Object.defineProperty(Gob.prototype, "$addPreFilter", propertySetting);


export default  Gob;






