import { GobState } from "@/core/giveHandler";
import { GobCore } from "@/core/index";
export interface HandlerContext {
    loaclData: any;
    localGate: any;
    state: GobState;
}
export interface Stimuli {
    type: string;
    path: string[] | string;
    value: any;
    origin: object | string | null;
    info?: {
        time?: Date;
        index?: number;
        typeIndex?: number;
    };
}
/**
 * 刺激总线
 */
declare class StimuliBus {
    stimuliLog: {
        changes: Stimuli[];
        visits: Stimuli[];
        indexes: {
            set: number;
            get: number;
            delete: number;
            all: number;
            [propName: string]: number;
        };
        latestPath: string[] | null;
        latestType: string | null;
    };
    gobCore: GobCore;
    constructor(gobCore: GobCore);
    /**
     * 总线的刺激受体，根据接收的刺激
     * @param {string} stimuliType 刺激类型 （'get','set'.'delete'）
     * @param {string[]} path 路径
     * @param {any} value 值
     * @param {object | string} origin 来源
     * @param {HandlerContext} handlerContext 上下文
     * @return {any}
     */
    receptor(this: any, stimuliType: string, path: string[], value: any, origin: object | string | null, handlerContext?: HandlerContext): any;
    /**
     * 记录刺激
     * @param {string} stimuliType
     * @param {string[]} path
     * @param value
     * @param {object | string | null} origin
     */
    recordStimuli(stimuliType: string, path: string[], value: any, origin: object | string | null): void;
    /**
     * 获取最后一次刺激的类型与路径
     * @returns {{type: string | null; path: string[] | null} | undefined}
     */
    getLatestStimuliSign(): {
        type: string | null;
        path: string[] | null;
    } | undefined;
}
export default StimuliBus;
