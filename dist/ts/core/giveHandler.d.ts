import { GobCore } from "@/core/index";
declare function giveHandler(gobCore: GobCore, path: string[], GOB_CORE_NAME: string): {
    "set": (target: any, key: any, value: any) => boolean;
    "get": (target: any, property: any) => any;
};
export default giveHandler;
