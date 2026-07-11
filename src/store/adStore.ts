import { create } from 'zustand'

/* ========================================================
   Ad Store — persisted to localStorage
   Runtime ad configuration, managed from /admin panel
   ======================================================== */

export interface AdStore {
  /* ---- Global ---- */
  adEnabled: boolean

  /* ---- Google AdSense ---- */
  googlePublisherId: string
  googleSidebarSlotId: string
  googleBannerSlotId: string

  /* ---- Baidu ---- */
  baiduSidebarSlotId: string
  baiduSidebarToken: string
  baiduBannerSlotId: string
  baiduBannerToken: string

  /* ---- Actions ---- */
  setAdEnabled: (v: boolean) => void
  updateGoogle: (patch: Partial<Pick<AdStore, 'googlePublisherId' | 'googleSidebarSlotId' | 'googleBannerSlotId'>>) => void
  updateBaidu: (patch: Partial<Pick<AdStore, 'baiduSidebarSlotId' | 'baiduSidebarToken' | 'baiduBannerSlotId' | 'baiduBannerToken'>>) => void
}

const STORAGE_KEY = 'zanpic_ad_config'

function load(): Partial<AdStore> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupt */ }
  return {}
}

function persist(state: Partial<AdStore>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

/** Read persisted values, falling back to defaults */
function getSaved(): Pick<AdStore, 'adEnabled' | 'googlePublisherId' | 'googleSidebarSlotId' | 'googleBannerSlotId' | 'baiduSidebarSlotId' | 'baiduSidebarToken' | 'baiduBannerSlotId' | 'baiduBannerToken'> {
  const saved = load()
  return {
    adEnabled: saved.adEnabled ?? false,
    googlePublisherId: saved.googlePublisherId ?? '',
    googleSidebarSlotId: saved.googleSidebarSlotId ?? '',
    googleBannerSlotId: saved.googleBannerSlotId ?? '',
    baiduSidebarSlotId: saved.baiduSidebarSlotId ?? '',
    baiduSidebarToken: saved.baiduSidebarToken ?? '',
    baiduBannerSlotId: saved.baiduBannerSlotId ?? '',
    baiduBannerToken: saved.baiduBannerToken ?? '',
  }
}

export const useAdStore = create<AdStore>((set) => ({
  ...getSaved(),

  setAdEnabled: (v) =>
    set((s) => {
      const next = { ...s, adEnabled: v }
      persist(next)
      return { adEnabled: v }
    }),

  updateGoogle: (patch) =>
    set((s) => {
      const next = { ...s, ...patch }
      persist(next)
      return { ...patch }
    }),

  updateBaidu: (patch) =>
    set((s) => {
      const next = { ...s, ...patch }
      persist(next)
      return { ...patch }
    }),
}))
