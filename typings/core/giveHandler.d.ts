import { GobCore } from "@/core/index";
/**
 * 创建一个基于 path 的代理处理器
 * @param loaclData
 * @param {string[]} loaclpath
 * @param {string[]} fullPath
 * @param {{gobCore: GobCore; GOB_CORE_NAME: string}} state
 * @returns {{set: (target: any, key: any, value: any) => boolean; get: (target: any, property: any) => (any)}}
 */
declare function giveHandler(loaclData: any, localGate: any, fullPath: string[], state: {
    coreData: any;
    coreGate: any;
    gobCore: GobCore;
    GOB_CORE_NAME: string;
}): {
    "set": (target: any, key: any, value: any) => boolean;
    "get": (target: any, key: any) => any;
};
export default giveHandler;
