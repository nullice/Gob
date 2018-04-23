// Created by nullice on 2018/04/17 - 14:39 

import giveHandler from "./giveHandler"
import {inspect} from "util"

const GOB_CORE_NAME = "[Gob Core]"


export class GobCore
{

    public data: object
    public gate: object
    public isGob = 3

    constructor()
    {
        this.data = {}
        this.gate = {}
    }
}


export interface GobProxy
{
    ["[Gob Core]"]?: GobCore,

    [propName: string]: any;
}


function GobFactory(this: any, object: any,): any
{
    let gobCore = new GobCore()

    let proxy: GobProxy = new Proxy(gobCore.data,
        giveHandler(gobCore.data, gobCore.gate, [], {
            coreData: gobCore.data,
            coreGate: gobCore.gate,
            gobCore,
            GOB_CORE_NAME
        })
    )

    proxy[GOB_CORE_NAME] = gobCore

    if (object)
    {
        for (var key in object)
        {
            proxy[key] = object[key]
        }
    }
    return proxy
}


/**
 * 注册一些方法和常量到 Gob
 */
Object.assign(GobFactory,
    {
        KEY: GOB_CORE_NAME,
        GOB_CORE_NAME,
        /**
         * 检查一个 gob 实例的 Core
         * @param gob
         * @returns {any}
         */
        inspect: function (gob: any)
        {

            let core = gob[GOB_CORE_NAME]
            if (core)
            {
                return gob[GOB_CORE_NAME]
            }
            else
            {
                throw Error("Gob.inspect: param is not Gob3 Instance")

            }
        }
    }
)


export default GobFactory
