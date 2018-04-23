export declare class GobCore {
    data: object;
    gate: object;
    isGob: number;
    constructor();
}
export interface GobProxy {
    ["[Gob Core]"]?: GobCore;
    [propName: string]: any;
}
declare function GobFactory(this: any, object: any): any;
export default GobFactory;
