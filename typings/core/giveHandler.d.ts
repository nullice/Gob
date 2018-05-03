import { GobCore } from "@/core/index";
export declare const GATE_PROXY_NAME = "[PROXY]";
export interface Gate {
    [GATE_PROXY_NAME]?: object;
    [propName: string]: any;
}
export interface GobState {
    coreData: any;
    coreGate: any;
    gobCore: GobCore;
    GOB_CORE_NAME: string;
}
export interface HandlerContext {
    loaclData: any;
    localGate: any;
    state: GobState;
}
/**
 * 创建一个基于 path 的代理处理器
 * @param loaclData
 * @param {string[]} loaclpath
 * @param {string[]} fullPath
 * @param {{gobCore: GobCore; GOB_CORE_NAME: string}} state
 * @returns {{set: (target: any, key: any, value: any) => boolean; get: (target: any, property: any) => (any)}}
 */
declare function giveHandler(loaclData: any, localGate: any, fullPath: string[], state: GobState): {
    "set": (target: any, key: any, value: any) => any;
    "get": (target: any, key: any) => any;
    "deleteProperty": (target: any, key: any) => any;
};
export default giveHandler;
