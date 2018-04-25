import {Type as rcType, Object as rcObject} from "richang.js/dist/RichangEs.js"
import giveHandler, {HandlerContext, Gate, GATE_PROXY_NAME} from "@/core/giveHandler"


/**
 * 收到 set 刺激后对 gob 实例进行的操作
 * @param {string[]} fullPath
 * @param value
 * @param {string} key
 * @param {HandlerContext} handlerContext handler
 */
function set(fullPath: string[], value: any, key: string, handlerContext: HandlerContext)
{
    let valueType = rcType.getType(value)
    console.log("[set]", "fullPath:", fullPath, {valueType, key, value})
    if (valueType === "object" || valueType === "array")
    {
        // 写入值到 data
        handlerContext.loaclData[key] = value

        // 创建 gate
        creatGate(value, [key], fullPath, handlerContext)

        // 遍历值来创建 gate
        rcObject.pathEach(value, function (item: any, path: string[])
        {
            if (typeof item === "object")
            {
                creatGate(item, [key, ...path], [...fullPath, ...path], handlerContext)
            }
        }, creatCycleGate)
    }
    else
    {
        handlerContext.loaclData[key] = value
    }

    return true

    /**
     * 为循环引用创建 Gate
     * @param {Object} object 循环引用对象
     * @param {string[]} path 发生循环引用的对象的 path
     * @param {string[]} cyclePath 循环引用目标的 path
     */
    function creatCycleGate(object: Object, path: string[], cyclePath: string[])
    {
        // console.log("  [cycle]", object, path, cyclePath)
        let cycleObject !: Object | undefined
        if (cyclePath.length == 0)
        {
            cycleObject = handlerContext.localGate[key]
        }
        else
        {
            cycleObject = rcObject.getObjectValueByNames(handlerContext.localGate, [key, cyclePath], null)
        }
        // console.log("  [cycle cycleObject]", cycleObject)
        rcObject.setObjectValueByNames(handlerContext.localGate, [key, ...path], cycleObject)
    }

}


/**
 * 在这个 Handler 的 localData 上根据 localPath 设置 Gate
 * @param {object} inData
 * @param {string[]} targetPath
 * @param {string[]} fullPath
 * @param handlerContext
 * @returns {Gate}
 */
function creatGate(inData: object, targetPath: string[], fullPath: string[], handlerContext: HandlerContext): any
{
    let gate: Gate = {}
    let proxy = new Proxy(inData, giveHandler(inData, gate, fullPath, handlerContext.state))
    gate[GATE_PROXY_NAME] = proxy
    rcObject.setObjectValueByNames(handlerContext.localGate, targetPath, gate)
    return gate
}

export default set
