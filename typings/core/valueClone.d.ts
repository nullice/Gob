/**
 * 拷贝值类型
 * @param {T} value
 * @returns {T}
 */
declare function valueClone<T>(value: T | undefined): T | undefined;
export default valueClone;
