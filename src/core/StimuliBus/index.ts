// Created by nullice on 2018/04/24 - 15:05

import {Type as rcType, Object as rcObject} from "richang.js/dist/RichangEs.js"
import {GobState} from "@/core/giveHandler"
import set from "./set"
import get from "./get"
import del from "./delete"
import IgnoreSideEffect from "./ignore-side-effect"

import {GobCore} from "@/core/index"

export interface HandlerContext
{
    loaclData: any,
    localGate: any,
    state: GobState
}


export interface Stimuli
{

    type: string,
    path: string[] | string,
    value: any,
    origin: object | string | null,
    info?: {
        time?: Date,
        index?: number,
        typeIndex?: number,
    }
}


/**
 * 刺激总线
 */
class StimuliBus
{
    public stimuliLog:
        {
            changes: Stimuli[],
            visits: Stimuli[],
            indexes: { set: number, get: number, delete: number, all: number, [propName: string]: number },
            latestPath: string[] | null,
            latestType: string | null,
        }
        = {
        changes: [],    // 存放改变值的刺激记录
        visits: [],     // 存放不改变值的刺激记录
        indexes: {      // 记录各种刺激的次数
            set: 0,
            get: 0,
            delete: 0,
            all: 0
        },
        latestPath: null, // 最后一次 Stimuli 用到的路径
        latestType: null, // 最后一次 Stimuli 类型
    }

    public gobCore: GobCore

    constructor(gobCore: GobCore)
    {
        this.gobCore = gobCore

    }


    /**
     * 总线的刺激受体，根据接收的刺激
     * @param {string} stimuliType 刺激类型 （'get','set'.'delete'）
     * @param {string[]} path 路径
     * @param {any} value 值
     * @param {object | string} origin 来源
     * @param {HandlerContext} handlerContext 上下文
     * @return {any}
     */
    public receptor(this: any, stimuliType: string, path: string[], value: any, origin: object | string | null, handlerContext?: HandlerContext)
    {
        console.log("[receptor]", handlerContext ? "<Handler>" : "<noHandler>", stimuliType, path)
        // 记录上下文
        if (handlerContext)
        {

            if (!IgnoreSideEffect(stimuliType, path, handlerContext))
            {
                // console.log("Ignore IgnoreSideEffect", handlerContext)
                this.recordStimuli(stimuliType, path, value, origin)
            }

        }

        switch (stimuliType)
        {
            case "get":
            {
                if (!handlerContext)
                {
                    console.log("getObjectValueByNames", path)
                    return rcObject.getObjectValueByNames(this.gobCore.proxy, path, null)
                }
                else
                {
                    return get(path, path[path.length - 1], handlerContext)
                }
            }
            case "set":
            {
                if (!handlerContext)
                {
                    return rcObject.setObjectValueByNames(this.gobCore.proxy, path, value)
                }
                else
                {
                    return set(path, value, path[path.length - 1], handlerContext)
                }
            }
            case "delete":
            {
                if (!handlerContext)
                {
                    return rcObject.deleteObjectValueByNames(this.gobCore.proxy, path)
                }
                else
                {
                    return del(path, value, path[path.length - 1], handlerContext)
                }
            }

            default:
            {
            }
        }
    }


    /**
     * 记录刺激
     * @param {string} stimuliType
     * @param {string[]} path
     * @param value
     * @param {object | string | null} origin
     */
    recordStimuli(stimuliType: string, path: string[], value: any, origin: object | string | null)
    {

        // 如果禁用记录，则立即返回
        if (this.gobCore.options.disableLog === true)
        {
            return
        }

        // 基本记录
        this.stimuliLog.latestPath = path
        this.stimuliLog.latestType = stimuliType
        let index = this.stimuliLog.indexes.all++
        let typeIndex = this.stimuliLog.indexes[stimuliType]++

        // 详细记录
        let logFunc = () =>
        {
            let stimuli: Stimuli = {
                type: stimuliType,
                path,
                value: this.gobCore.GobFactory.default.cloneDeep(value),
                origin: origin,
                info: {
                    index: index,
                    typeIndex: typeIndex,
                }
            }
            console.log("[Stimuli]", stimuli)
            if (stimuliType === "set" || stimuliType === "delete")
            {
                this.stimuliLog.changes.push(stimuli)
            }
            else
            {
                this.stimuliLog.visits.push(stimuli)
            }
        }


        if (this.gobCore.options.syncLog === true)
        {
            // 同步记录
            logFunc()
        }
        else
        {
            // 异步记录
            setTimeout(logFunc, 0)
        }

    }


    /**
     * 获取最后一次刺激的类型与路径
     * @returns {{type: string | null; path: string[] | null} | undefined}
     */
    getLatestStimuliSign(): { type: string | null, path: string[] | null } | undefined
    {
        if (this.stimuliLog.latestType)
        {
            return {
                type: this.stimuliLog.latestType,
                path: this.stimuliLog.latestPath
            }
        }
    }
}

export default StimuliBus
