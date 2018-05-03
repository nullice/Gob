import { HandlerContext } from "@/core/StimuliBus/index";
/**
 * 刺激检查，忽略一些刺激不记录到 stimuliLog ，比如忽略数组添加成员时对 length 的 set
 * @param {string[]} path
 * @param {HandlerContext} handlerContext
 * @returns {Boolean}
 */
declare function igonreSideEffect(stimuliType: string, path: string[], handlerContext: HandlerContext): Boolean;
export default igonreSideEffect;
