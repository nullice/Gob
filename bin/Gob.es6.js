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
 * Created by nullice on 2017/5/14.
 */


var Gob = function ()
{
    this.$isGob = true;
    this.$_setCount = 0;
    this.$_changeCount = 0;
    this.$_states = {};
    this.$fitlers = {
        preFilters: {__root: {}},
        finFilters: {__root: {}},
    };

    return this;
};


Gob.prototype.$addFilter = function (fitlerType, filterName, filterFunction, keyPath)
{
    var keys = keyPathToKeys(keyPath);

    if (fitlerType === "pre")
    {
        var tragetFilters = this.$fitlers.preFilters;
    } else if (fitlerType === "fin")
    {
        var tragetFilters = this.$fitlers.finFilters;
    }

    console.log("$addFilter", tragetFilters, keys.concat(["__root", filterName]));
    objectOBJ.setObjectValueByNames(tragetFilters, keys.concat(["__root", filterName]), filterFunction);
};


Gob.prototype.$_getFilterByKeys = function (fitlerType, keys)
{
    if (fitlerType === "pre")
    {
        var tragetFilters = this.$fitlers.preFilters;
    } else if (fitlerType === "fin")
    {
        var tragetFilters = this.$fitlers.finFilters;
    }
    var filters = [];
    for (var i = 0; i < keys.length + 1; i++)
    {
        var oncefilters = [];
        var onceKeys = keys.splice(0, keys.length - i);
        console.info("scan filter:", onceKeys.concat(["__root"]));
        var filtersOb = objectOBJ.getObjectValueByNames(tragetFilters, onceKeys.concat(["__root"]));
        for (var x in filtersOb)
        {
            oncefilters.push(filtersOb[x]);
        }
        oncefilters.sort();
        filters = oncefilters.concat(filters);
    }

    return filters
};


/**
 * 根据键名列表获取键值
 * @param keys
 * @returns {Promise.<*>}
 */
Gob.prototype.$getValue = function (keys)
{
    console.log("$getValue", keys, value);
    var value = objectOBJ.getObjectValueByNames(this.$_states, keys);
    return value
};


Gob.prototype.$setValue = async function (keys, value, onlySet)
{
    console.log("$setValue", keys, value);
    //0. 计数
    this.$_setCount++;


    //1. preFilter
    // var filters = this.$_getFilterByKeys("pre", keys)
    // console.log("$setValue filters",keys, filters)

    var change = setObjectValueByKeys(this.$_states, keys, value);


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
};

Gob.prototype.$newStates = function (object)
{
    var self = this;
    giveSetter(object, [], 0, self, this);
};
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
        var newKeys = keys.concat(key);
        var isObject = false;
        if (object[key] != undefined)
        {
            isObject = (typeTYP.type(object[key]) === "object");
        }
        if (isObject && objectOBJ.isEmptyObject(object[key]) !== true)
        {
            gob[key] = {};
            giveSetter(object[key], newKeys.slice(0), index + 1, self, gob[key]);
        } else
        {

            Object.defineProperty(gob, key, setterCreators(newKeys.slice(0), self));
            self.$setValue(newKeys, object[key]);//赋予默认值
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
        // console.log("creat get keys", keys, " self:", self)
        return function ()
        {
            return self.$getValue(keys)
        }
    })(keys, self);

    var setter = (function (keys, self)
    {
        // console.log("creat set keys", keys, " self:", self)
        return function (value)
        {
            self.$setValue(keys, value);
        }
    })(keys, self);


    var ob = {
        set: setter,
        get: getter,
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
function setObjectValueByKeys(object, keys, value, preFilter)
{
    var nowObject;
    var change = false;


    if (typeof preFilter === "function") //设置前过滤器
    {
        var _valuePreFilter = preFilter;
    } else
    {
        var _valuePreFilter = function (oldValue, newValue, keys) {return newValue};
    }


    if (keys.length == 1)
    {
        var oldValue = object[keys[0]];
        change = _checkChange(oldValue, value);
        object[keys[0]] = _valuePreFilter(oldValue, value, keys);
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
                change = _checkChange(oldValue, value);
                nowObject[keys[1]] = _valuePreFilter(oldValue, value, keys);
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
                change = _checkChange(oldValue, value);
                nowObject[keys[i + 1]] = _valuePreFilter(oldValue, value, keys);
                return change
            }

        }
    }
    return change


    function _checkChange(oldValue, newValue)
    {
        if (oldValue === newValue)
        {
            return false
        } else
        {
            return {oldValue: oldValue}
        }
    }


}


//-----------------------------------------------------------
Gob.prototype.sleep = async function (ms)
{
    return new Promise(function (resolve, reject)
    {
        setTimeout(() =>
        {
            resolve(ms);
        }, ms);
    })
};

Gob.prototype.doAsync = async function ()
{
    console.log("ssss1");
    var a = await  this.sleep();
    console.log("ssss2", a);
};

export default Gob;
