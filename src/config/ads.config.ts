/**
 * 广告配置（默认值 + 运行时接口）
 *
 * 运行时广告代码通过 /admin 管理后台设置，存储在 localStorage。
 * 以下为类型定义和默认占位值。
 */

/* ---------- 广告平台类型 ---------- */
export type AdPlatform = 'google' | 'baidu'

export interface GoogleSlotConfig {
  publisherId: string
  adUnitId: string
}

export interface BaiduSlotConfig {
  slotId: string
  token: string
  width: number
  height: number
}

/* ---------- 全局开关（兼容旧版环境变量） ---------- */
/** @deprecated 使用 useAdStore().adEnabled 代替 */
export const AD_ENABLED = import.meta.env.VITE_AD_ENABLED === 'true'

/* ---------- Google AdSense 默认值 ---------- */
export const googleAds = {
  src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
  /** 默认 publisherId — 上线时在 /admin 中填入实际值 */
  defaultPublisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
  slots: {
    sidebar: {
      sizes: [[300, 250], [300, 600]] as [number, number][],
    },
    banner: {
      sizes: [[728, 90], [970, 90]] as [number, number][],
    },
  },
} as const

/* ---------- 百度广告 默认值 ---------- */
export const baiduAds = {
  src: 'https://cpro.baidustatic.com/cpro/ui/c.js',
  slots: {
    sidebar: { width: 300, height: 250 },
    banner: { width: 960, height: 90 },
  },
} as const
