import {Type as rcType, Object as rcObject} from "richang.js/dist/RichangEs.js"
import giveHandler, {HandlerContext, Gate, GATE_PROXY_NAME} from "@/core/giveHandler"


/**
 * 收到 delete 刺激后对 gob 实例进行的操作
 * @param {string[]} fullPath
 * @param value
 * @param {string} key
 * @param {HandlerContext} handlerContext handler
 */
function del(fullPath: string[], value: any, key: string, handlerContext: HandlerContext)
{
    let valueType = rcType.getType(value)
    console.log("[del]", "fullPath:", fullPath, { key})
    return delete handlerContext.loaclData[key]
}


export default del
