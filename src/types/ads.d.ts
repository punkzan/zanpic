/**
 * 第三方广告脚本全局类型声明
 *
 * Google AdSense 和百度广告的脚本会在运行时注入全局命名空间，
 * 这里提供类型声明避免 TypeScript 编译报错。
 */

interface Window {
  /** Google AdSense 广告队列 */
  adsbygoogle?: unknown[]
  /** 百度广告填充函数 */
  BAIDU_CLB_fillSlot?: (slotId: string) => void
  /** 百度广告位注册映射 */
  BAIDU_CLB_slotMap?: Array<{ slotId: string; token: string }>
}
