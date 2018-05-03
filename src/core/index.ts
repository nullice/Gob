// Created by nullice on 2018/04/17 - 14:39 

import giveHandler from "./giveHandler"
import StimuliBus from "./StimuliBus/index"
import {inspect} from "util"
import cloneDeep from "lodash/cloneDeep"
const GOB_CORE_NAME = "[Gob Core]"


/*
*
*    GobFactory(state) =>  gob instance = GobProxy: {GobCore + state }
* */

export class GobCore
{
    public data: object
    public gate: object
    public options: GobOptions
    public proxy: any
    public GobFactory = GobFactory

    public stimuliBus = new StimuliBus(this)
    public isGob = 3

    constructor(options: GobOptions = {})
    {
        this.data = {}
        this.gate = {}
        this.options = options

    }
}

export interface GobOptions
{
    // 是否同步记录刺激，默认为 false ，异步记录可以让性能表现更好
    syncLog?: Boolean,
    // 禁止记录 Log，默认为 false ，
    disableLog?: Boolean,

    [propName: string]: any;
}


export interface GobProxy
{
    ["[Gob Core]"]?: GobCore,
    $get?: (path: string | string[]) => any,
    $set?: (path: string | string[], value: any) => Boolean,

    [propName: string]: any;
}

interface GobFactory
{
    (this: any, object: any, options?: object): GobProxy;

    default: {
        options: GobOptions,
        cloneDeep: Function,
    }
    GOB_CORE_NAME: string,
    inspect: Function

}

let GobFactory = <GobFactory> function (this: any, object: any, options?: object): GobProxy
{
    // 创建一个 GobCore
    let gobCore = new GobCore(options)

    // 创建一个代理
    let proxy: GobProxy = new Proxy(gobCore.data,
        giveHandler(gobCore.data, gobCore.gate, [], {
            coreData: gobCore.data,
            coreGate: gobCore.gate,
            gobCore,
            GOB_CORE_NAME
        })
    )

    // 设置初始值
    if (object)
    {
        for (var key in object)
        {
            proxy[key] = object[key]
        }
    }

    gobCore.proxy = proxy
    return proxy
}


// GobFactory 提供的默认设置
GobFactory.default = {
    options: {},
    cloneDeep: cloneDeep
}

// 注册一些方法和常量到 Gob
GobFactory.GOB_CORE_NAME = GOB_CORE_NAME

/**
 * 检查一个 gob 实例的 Core
 * @param gob
 * @returns {any}
 */
GobFactory.inspect = function (gob: any): GobCore
{

    let core = gob[GOB_CORE_NAME]
    if (core)
    {
        return gob[GOB_CORE_NAME]
    }
    else
    {
        throw Error("Gob.inspect: param is not Gob3 Instance. :" + gob)

    }
}


export default GobFactory
