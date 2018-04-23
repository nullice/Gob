export declare class GobCore {
    data: object;
    isGob: number;
    constructor();
}
export interface GobProxy {
    ["[Gob Core]"]?: GobCore;
    [propName: string]: any;
}
declare function GobFactory(this: any): GobProxy;
export default GobFactory;
