import { useEffect } from 'react'

/* ================================================================
   Daily background hook — multi-source, globally accessible

   Fetch chain:
     1. Bing Global (www.bing.com, mkt=en-US) — free, global CDN
     2. Picsum (picsum.photos) — free, no auth, global CDN
     3. Static Unsplash fallback URLs — always available

   Sets --daily-bg-url CSS variable on :root
   Adds .has-daily-bg class on <body>
   ================================================================ */

interface CacheEntry {
  date: string
  url: string
  source: string
}

const CACHE_KEY = 'zanpic_bg_cache'
const URL_VAR = '--daily-bg-url'
const BODY_CLASS = 'has-daily-bg'

// Static fallback — high-quality nature photos from Unsplash (direct CDN links)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80',
]

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Source 1: Bing global (www.bing.com, mkt=en-US) ──
async function fetchBingGlobal(): Promise<string> {
  const res = await fetch(
    'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US',
  )
  if (!res.ok) throw new Error(`Bing global ${res.status}`)
  const data = await res.json()
  if (!data?.images?.[0]?.url) throw new Error('No image')
  return `https://www.bing.com${data.images[0].url}`
}

// ── Source 2: Picsum (free, no auth, global CDN via Cloudflare) ──
async function fetchPicsum(): Promise<string> {
  // Picsum returns a redirect to the actual image; we resolve it to get the canonical URL
  const res = await fetch('https://picsum.photos/1920/1080?random=' + Date.now())
  if (!res.ok) throw new Error(`Picsum ${res.status}`)
  return res.url
}

// ── Cache helpers ──
function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) {
      const entry = JSON.parse(raw) as CacheEntry
      if (entry && typeof entry.date === 'string' && typeof entry.url === 'string') {
        return entry
      }
    }
  } catch { /* corrupt */ }
  return null
}

function writeCache(url: string, source: string) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ date: getToday(), url, source }))
  } catch { /* quota */ }
}

// ── DOM helpers ──
function applyBackground(url: string) {
  document.documentElement.style.setProperty(URL_VAR, `url(${url})`)
  document.body.classList.add(BODY_CLASS)
}

function clearBackground() {
  document.documentElement.style.removeProperty(URL_VAR)
  document.body.classList.remove(BODY_CLASS)
}

export function useDailyBackground() {
  useEffect(() => {
    let cancelled = false
    const today = getToday()

    // 1. If we have today's cached image, use it immediately
    const cached = readCache()
    if (cached && cached.date === today) {
      applyBackground(cached.url)
      return () => { if (!cancelled) clearBackground() }
    }

    // 2. Multi-source fetch with fallback chain
    async function fetchWithFallback(): Promise<{ url: string; source: string }> {
      // Try Bing global first
      try {
        const url = await fetchBingGlobal()
        return { url, source: 'bing' }
      } catch {
        console.debug('[DailyBG] Bing global failed, trying Picsum...')
      }

      // Try Picsum second
      try {
        const url = await fetchPicsum()
        return { url, source: 'picsum' }
      } catch {
        console.debug('[DailyBG] Picsum failed, using static fallback...')
      }

      // Static Unsplash fallback — always works
      return { url: pickRandom(FALLBACK_IMAGES), source: 'unsplash-static' }
    }

    fetchWithFallback()
      .then(({ url, source }) => {
        if (cancelled) return
        applyBackground(url)
        writeCache(url, source)
      })
      .catch(() => {
        if (cancelled) return
        // Last resort: stale cache
        const stale = readCache()
        if (stale) applyBackground(stale.url)
      })

    return () => {
      cancelled = true
      clearBackground()
    }
  }, [])
}
