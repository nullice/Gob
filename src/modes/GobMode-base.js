/**
 * Created by nullice on 2017/5/16.
 */


import  TYP from "./../lib/Richang_JSEX/typeTYP.js"

var data = {
    text: {
        fontFamily: {type: "string", default: "微软雅黑"},
        colorHex: {type: "string", default: "#ffe"},
        color: {
            r: {type: "number", default: 244, range: [0, 255]},
            g: {type: "number", default: 244, range: [0, 255]},
            b: {type: "number", default: 244, range: [0, 255]},
        },
        fontSize: {type: "number", default: 32, range: [12, 72]},
    }
}

var GobMode_base_init = function ()
{
    this.$mode = "base"
    this.$addFilter("pre", "type", pre_type, [], 9)
    this.$addFilter("pre", "range", pre_range, [], 10)


}


function pre_range(oldValue, finValue, keys, who, setterReturnInfo)
{
    var dataRange = this.$_getStateModeValueByKeys(keys.concat(["range"]))
    if (dataRange != undefined && dataRange.length != undefined && dataRange.length === 2)
    {
        if (finValue > dataRange[1]) finValue = dataRange[1];
        if (finValue < dataRange[0]) finValue = dataRange[0];
    }
    return finValue
}

function pre_type(oldValue, finValue, keys, who, setterReturnInfo)
{
    var type = this.$_getStateModeValueByKeys(keys.concat(["type"]))
    if (type != undefined)
    {
        var finValueType = TYP.type(finValue)
        if (finValueType !== type)
        {
            if (type === "number")
            {
                if (finValueType === "string")
                {
                    var reg = /(-){0,1}[0-9]+/
                    var re = reg.exec(finValue)
                    if (re != undefined)
                    {
                        var finValue = Number(re[0])
                        if (finValue !== NaN)
                        {
                            return finValue
                        }
                    }
                }
            } else (type === "striing")
            {
                return "" + finValue
            }
        }
    }
    return oldValue
}


export default GobMode_base_init
