// Created by nullice on 2018/05/02 - 14:34 


import {HandlerContext} from "@/core/StimuliBus/index"


interface StimuliPerson
{
    stimuliType: string,
    path: string[],
    loaclDataIsArray: boolean,
}

let latest: StimuliPerson | null = null

/**
 * 刺激检查，忽略一些刺激不记录到 stimuliLog ，比如忽略数组添加成员时对 length 的 set
 * @param {string[]} path
 * @param {HandlerContext} handlerContext
 * @returns {Boolean}
 */
function igonreSideEffect(stimuliType: string, path: string[], handlerContext: HandlerContext): Boolean
{
    let loaclDataIsArray = Array.isArray(handlerContext.loaclData)
    if (loaclDataIsArray)
    {
        if (path[path.length - 1] === "length")
        {
            if (latest)
            {
                if (latest.stimuliType === "set" && latest.loaclDataIsArray == true)
                {
                    // 上一次刺激不是设置 length
                    if (latest.path && latest.path[latest.path.length - 1] !== "length")
                    {
                        _logLatest(stimuliType, path, loaclDataIsArray)
                        return true
                    }
                }
            }
        }
    }

    _logLatest(stimuliType, path, loaclDataIsArray)
    return false
}


/**
 * 记录本次刺激特征，为下一次刺激检查备用
 * @param {string} stimuliType
 * @param {string[]} path
 * @param {boolean} loaclDataIsArray
 * @private
 */
function _logLatest(stimuliType: string, path: string[], loaclDataIsArray: boolean)
{
    latest = {stimuliType, path, loaclDataIsArray}
}


export default igonreSideEffect
