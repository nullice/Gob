import { HandlerContext } from "@/core/giveHandler";
/**
 * 收到 set 刺激后对 gob 实例进行的操作
 * @param {string[]} fullPath
 * @param value
 * @param {string} key
 * @param {HandlerContext} handlerContext handler
 */
declare function set(fullPath: string[], value: any, key: string, handlerContext: HandlerContext): boolean;
export default set;
