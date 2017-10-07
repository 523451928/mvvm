/**
 * 运行环境变量
 * @module util/env
 */

// Browser environment sniffing
export const inBrowser = typeof window !== 'undefined'


// can we use __proto__?
// {}.__proto__ === Object.prototype
export const hasProto = '__proto__' in {}
