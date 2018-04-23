import {GobCore} from "@/core/index"


import {Type as rcType, Object as rcObject} from "richang.js/dist/RichangEs.js"


const GATE_PROXY_NAME = "[PROXY]"

interface Gate
{
    [GATE_PROXY_NAME]?: object

    [propName: string]: any;
}

/**
 * 创建一个基于 path 的代理处理器
 * @param loaclData
 * @param {string[]} loaclpath
 * @param {string[]} fullPath
 * @param {{gobCore: GobCore; GOB_CORE_NAME: string}} state
 * @returns {{set: (target: any, key: any, value: any) => boolean; get: (target: any, property: any) => (any)}}
 */

function giveHandler(loaclData: any, localGate: any, fullPath: string[], state: { coreData: any, coreGate: any, gobCore: GobCore, GOB_CORE_NAME: string })
{

    return {
        "set": function (target: any, key: any, value: any)
        {
            // 处理特殊属性 [Gob Core]
            if (key == state.GOB_CORE_NAME)
            {
                return true
            }
            let nowFullPath = [...fullPath, key]
            console.log("[set]", "fullPath:", nowFullPath, {key, target, value})

            // 根据值属性处理写入值
            let valueType = rcType.getType(value)
            if (valueType === "object")
            {
                // 写入值到 data
                // rcObject.setObjectValueByNames(loaclData, nowLocalPath, value)
                loaclData[key] = value

                // 创建 gate
                creatGate(value, [key], nowFullPath)

                // 遍历值来创建 gate
                rcObject.pathEach(value, function (item: any, path: string[])
                {
                    if (typeof item === "object")
                    {
                        creatGate(item, [key, ...path], [...nowFullPath, ...path])
                    }
                }, creatCycleGate)
            }
            else
            {
                loaclData[key] = value
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
                    cycleObject = localGate[key]
                }
                else
                {
                    cycleObject = rcObject.getObjectValueByNames(localGate, [key, cyclePath], null)
                }
                // console.log("  [cycle cycleObject]", cycleObject)
                rcObject.setObjectValueByNames(localGate, [key, ...path], cycleObject)
            }


            /**
             * 在这个 Handler 的 localData 上根据 localPath 设置 Gate
             * @param {object} localData
             * @param {string[]} targetPath
             * @param {string[]} fullPath
             * @returns {any}
             */
            function creatGate(localData: object, targetPath: string[], fullPath: string[]): any
            {
                console.log("  [creatGate] key:", key, "fullPath", nowFullPath, {targetPath, localGate})

                let gate: Gate = {}
                let proxy = new Proxy(localData, giveHandler(localData, gate, fullPath, state))
                gate[GATE_PROXY_NAME] = proxy

                rcObject.setObjectValueByNames(localGate, targetPath, gate)

                return gate
            }
        },
        "get": function (target: any, key: any)
        {

            // 处理特殊属性 [Gob Core]
            if (key == state.GOB_CORE_NAME)
            {
                return state.gobCore
            }

            let nowLocalPath = [key]
            let nowFullPath = [...fullPath, key]

            // 获取原始值
            // let value = rcObject.getObjectValueByNames(loaclData, [key], null)
            let value = loaclData[key]
            console.log("[get]", nowFullPath, {loaclData, nowLocalPath, key, target})


            // 根据值属性处理读出值
            let valueType = rcType.getType(value)
            console.log("  [get value]", value, valueType)

            if (valueType === "object")
            {
                console.log("  [find gates]", nowFullPath, {key, nowLocalPath, localGate})
                let gate = localGate[key]
                return gate[GATE_PROXY_NAME]
            }
            else
            {
                console.log("  return value", value)
                return value
            }


        },
    }
}


export default giveHandler
