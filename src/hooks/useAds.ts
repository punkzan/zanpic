import { useEffect, useRef, useCallback, useState } from 'react'
import { googleAds, baiduAds, type AdPlatform } from '../config/ads.config'
import { useAdStore } from '../store/adStore'

/** 已注入的脚本 URL 集合（全局去重，避免多个组件重复注入） */
const injectedScripts = new Set<string>()

/**
 * 广告脚本 & 生命周期管理
 *
 * 用法：
 *   const { containerRef, adReady } = useAds('google', 'sidebar')
 *   return <div ref={containerRef} />
 *
 * Google AdSense 在启用后调用 (adsbygoogle.push) 渲染
 * 百度广告 在启用后调用 BAIDU_CLB_fillSlot()
 */
export function useAds(platform: AdPlatform, slot: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [adReady, setAdReady] = useState(false)
  const pushAttemptedRef = useRef(false)

  // Read from store
  const adEnabled = useAdStore((s) => s.adEnabled)
  const googlePublisherId = useAdStore((s) => s.googlePublisherId)
  const googleSidebarSlotId = useAdStore((s) => s.googleSidebarSlotId)
  const googleBannerSlotId = useAdStore((s) => s.googleBannerSlotId)
  const baiduSidebarSlotId = useAdStore((s) => s.baiduSidebarSlotId)
  const baiduSidebarToken = useAdStore((s) => s.baiduSidebarToken)
  const baiduBannerSlotId = useAdStore((s) => s.baiduBannerSlotId)
  const baiduBannerToken = useAdStore((s) => s.baiduBannerToken)

  const injectScript = useCallback((url: string): Promise<void> => {
    if (injectedScripts.has(url)) return Promise.resolve()

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = url
      script.async = true
      script.crossOrigin = 'anonymous'
      script.onload = () => {
        injectedScripts.add(url)
        resolve()
      }
      script.onerror = () => reject(new Error(`Failed to load ad script: ${url}`))
      document.head.appendChild(script)
    })
  }, [])

  useEffect(() => {
    if (!adEnabled) return

    const loadAd = async () => {
      try {
        if (platform === 'google') {
          // Check if this slot is configured
          const slotId = slot === 'sidebar' ? googleSidebarSlotId : googleBannerSlotId
          if (!googlePublisherId || !slotId) return

          await injectScript(googleAds.src)

          if (containerRef.current && !pushAttemptedRef.current) {
            pushAttemptedRef.current = true

            const tryPush = () => {
              const w = window as unknown as Record<string, unknown>
              if (w.adsbygoogle && Array.isArray(w.adsbygoogle)) {
                ;(w.adsbygoogle as unknown[]).push({})
                setAdReady(true)
              } else {
                setTimeout(tryPush, 200)
              }
            }
            tryPush()
          }
        } else if (platform === 'baidu') {
          const bSlotId = slot === 'sidebar' ? baiduSidebarSlotId : baiduBannerSlotId
          const bToken = slot === 'sidebar' ? baiduSidebarToken : baiduBannerToken
          if (!bSlotId || !bToken) return

          await injectScript(baiduAds.src)

          if (containerRef.current && !pushAttemptedRef.current) {
            pushAttemptedRef.current = true

            const tryFill = () => {
              const w = window as unknown as Record<string, Function>
              if (typeof w.BAIDU_CLB_fillSlot === 'function') {
                w.BAIDU_CLB_fillSlot(bSlotId)
                setAdReady(true)
              } else {
                setTimeout(tryFill, 200)
              }
            }
            tryFill()
          }
        }
      } catch (err) {
        console.warn(`[Ads] Failed to load ${platform} ad:`, err)
      }
    }

    loadAd()
  }, [platform, slot, injectScript, adEnabled, googlePublisherId, googleSidebarSlotId, googleBannerSlotId, baiduSidebarSlotId, baiduSidebarToken, baiduBannerSlotId, baiduBannerToken])

  return { containerRef, adReady }
}
