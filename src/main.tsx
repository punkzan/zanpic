import { StrictMode, lazy, Suspense, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import App from './App'
import './index.css'
import './i18n'

// Lazy-load all content pages for better code splitting
const AboutPage = lazy(() => import('./pages/AboutPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const BlogListPage = lazy(() => import('./pages/BlogListPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

function LazyPage({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-tertiary)' }}>
        Loading…
      </div>
    }>
      {children}
    </Suspense>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/about', element: <LazyPage><AboutPage /></LazyPage> },
  { path: '/privacy', element: <LazyPage><PrivacyPage /></LazyPage> },
  { path: '/contact', element: <LazyPage><ContactPage /></LazyPage> },
  { path: '/blog', element: <LazyPage><BlogListPage /></LazyPage> },
  { path: '/blog/:id', element: <LazyPage><BlogPostPage /></LazyPage> },
  { path: '/admin', element: <LazyPage><AdminPage /></LazyPage> },
  { path: '*', element: <Navigate to="/" replace /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

// Hide SEO fallback content once React mounts (pre-rendered pages)
const seoFallback = document.getElementById('seo-fallback')
if (seoFallback) {
  seoFallback.style.display = 'none'
}
