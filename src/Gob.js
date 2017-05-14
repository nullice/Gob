/**
 * Created by nullice on 2017/5/14.
 */


import  TYP from "./lib/Richang_JSEX/typeTYP.js"
import  OBJ from "./lib/Richang_JSEX/objectOBJ.js"

var Gob = function ()
{

    this.$isGob = true;
    this.$_states = {};
    return this;
}


Gob.prototype.$newStates = function (object)
{
    var self = this
    giveSetter(object, [], -1,self)
}
Object.defineProperty(Gob.prototype, "$newStates", {writable: false});


/**
 *
 * @param object
 * @param keys
 * @param index
 * @param self
 */
function giveSetter(object, keys, index, self)
{
    for (var key in object)
    {
        var isObject = false
        if (object[key] != undefined)
        {
            isObject = (TYP.type(object[key]) === "object")
        }

        if (isObject)
        {
            giveSetter(object[key], keys.concat(key), index + 1, self);
        } else
        {
            keys = keys.concat(key)
            Object.defineProperty(object, key, _setterCreators(keys, object[key]));
        }
    }
}


//-------------------------------------------------------

/**
 * 创造一个 {set,get} 对象，用于创建属性
 * @param keys 键名列表
 * @returns {{set: *, get: *, value: *}}
 * @private
 */
function _setterCreators(keys)
{
    var setter = new Function("value", `this.$setValue(${JSON.stringify(keys)} , value )`);
    var getter = new Function(` return this.$getValue(${JSON.stringify(keys)} )`);
    var ob = {
        set: setter,
        get: getter,
    }
    return ob;
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
