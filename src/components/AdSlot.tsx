import { type AdPlatform } from '../config/ads.config'
import { googleAds, baiduAds } from '../config/ads.config'
import { useAdStore } from '../store/adStore'
import { useAds } from '../hooks/useAds'
import { useTranslation } from 'react-i18next'

export interface AdSlotProps {
  /** 广告平台 */
  platform: AdPlatform
  /** 广告位 key（sidebar | banner） */
  slot: 'sidebar' | 'banner'
  /** 占位模式下显示的标签 */
  label?: string
  /** 额外 className */
  className?: string
}

/**
 * 通用广告位组件
 *
 * 广告代码通过 /admin 后台管理（localStorage 持久化）。
 * 未配置时显示占位虚线框，配置并启用后加载真实广告。
 */
export function AdSlot({ platform, slot, label, className = '' }: AdSlotProps) {
  const { t } = useTranslation()
  const adEnabled = useAdStore((s) => s.adEnabled)
  const googlePublisherId = useAdStore((s) => s.googlePublisherId)
  const googleBannerSlotId = useAdStore((s) => s.googleBannerSlotId)
  const googleSidebarSlotId = useAdStore((s) => s.googleSidebarSlotId)
  const baiduSidebarSlotId = useAdStore((s) => s.baiduSidebarSlotId)
  const baiduSidebarToken = useAdStore((s) => s.baiduSidebarToken)
  const baiduBannerSlotId = useAdStore((s) => s.baiduBannerSlotId)
  const baiduBannerToken = useAdStore((s) => s.baiduBannerToken)

  const { containerRef } = useAds(platform, slot)

  // Determine size
  const getSize = () => {
    if (platform === 'google') {
      const [w, h] = googleAds.slots[slot].sizes[0]
      return { width: w, height: h }
    } else {
      const bSlot = baiduAds.slots[slot]
      return { width: bSlot.width, height: bSlot.height }
    }
  }

  const size = getSize()
  const positionName = slot === 'sidebar' ? t('adSlot.sidebar') : t('adSlot.bottomBanner')
  const defaultLabel = platform === 'google'
    ? t('adSlot.googlePrefix', { pos: positionName })
    : t('adSlot.baiduPrefix', { pos: positionName })

  // Check if this specific slot is configured
  const isConfigured = platform === 'google'
    ? !!(googlePublisherId && (slot === 'sidebar' ? googleSidebarSlotId : googleBannerSlotId))
    : !!(slot === 'sidebar'
      ? (baiduSidebarSlotId && baiduSidebarToken)
      : (baiduBannerSlotId && baiduBannerToken))

  if (!adEnabled || !isConfigured) {
    /* ---- 占位模式 ---- */
    return (
      <div
        className={`ad-placeholder ${className}`}
        style={{
          width: Math.min(size.width, 300),
          height: Math.min(size.height, 250),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          border: '1px dashed var(--border-color)',
          borderRadius: 8,
          background: 'var(--bg-secondary)',
          color: 'var(--text-tertiary)',
          fontSize: 12,
          opacity: 0.55,
          userSelect: 'none',
          cursor: 'default',
          flexShrink: 0,
          margin: '0 auto',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.5}>
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M12 12h.01M17 12h.01M7 12h.01" />
        </svg>
        <span style={{ textAlign: 'center', lineHeight: 1.4 }}>
          {label ?? defaultLabel}
        </span>
      </div>
    )
  }

  /* ---- 正式模式 ---- */
  if (platform === 'google') {
    const slotId = slot === 'sidebar' ? googleSidebarSlotId : googleBannerSlotId
    return (
      <div ref={containerRef} className={`ad-slot-google ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: size.width, height: size.height }}
          data-ad-client={googlePublisherId}
          data-ad-slot={slotId}
          data-full-width-responsive="true"
          data-ad-format="auto"
        />
      </div>
    )
  } else {
    const bSlotId = slot === 'sidebar' ? baiduSidebarSlotId : baiduBannerSlotId
    const bToken = slot === 'sidebar' ? baiduSidebarToken : baiduBannerToken
    const bSlot = baiduAds.slots[slot]
    return (
      <div className={`ad-slot-baidu ${className}`}>
        <div
          ref={containerRef}
          id={bSlotId}
          style={{ width: bSlot.width, height: bSlot.height }}
        />
        {/* eslint-disable-next-line react/no-danger */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(window.BAIDU_CLB_slotMap = window.BAIDU_CLB_slotMap || []).push({slotId:'${bSlotId}',token:'${bToken}'})`,
          }}
        />
      </div>
    )
  }
}
