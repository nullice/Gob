import {Type as rcType, Object as rcObject} from "richang.js/dist/RichangEs.js"
import giveHandler, {HandlerContext, Gate, GATE_PROXY_NAME} from "@/core/giveHandler"


/**
 *
 * @param {string[]} fullPath
 * @param {string} key
 * @param {HandlerContext} handlerContext
 * @returns {any}
 */
function get(fullPath: string[], key: string, handlerContext: HandlerContext)
{
    // 获取原始值
    // let value = rcObject.getObjectValueByNames(loaclData, [key], null)
    let value = handlerContext.loaclData[key]
    console.log("[get]", fullPath, {loaclData: handlerContext.loaclData, key})


    // 根据值属性处理读出值
    let valueType = rcType.getType(value)
    console.log("  [get value]", value, valueType)

    if (valueType === "object" || valueType === "array")
    {
        console.log("  [find gates]", fullPath)
        let gate = handlerContext.localGate[key]
        return gate[GATE_PROXY_NAME]
    }
    {
        console.log("  return value", value)
        return value
    }
}

export default get
