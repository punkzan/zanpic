import { StrictMode, lazy, Suspense, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import App from './App'
import { SeoLangProvider } from './components/SeoLangProvider'
import './index.css'
import './i18n'

// Lazy-load all content pages for better code splitting
const AboutPage = lazy(() => import('./pages/AboutPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const BlogListPage = lazy(() => import('./pages/BlogListPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const ToolIdPhotoPage = lazy(() => import('./pages/ToolIdPhotoPage'))
const ToolBackgroundRemoverPage = lazy(() => import('./pages/ToolBackgroundRemoverPage'))
const ToolPhotoResizerPage = lazy(() => import('./pages/ToolPhotoResizerPage'))
const ToolPhotoFilterPage = lazy(() => import('./pages/ToolPhotoFilterPage'))
const IdPhotoSpecPage = lazy(() => import('./pages/IdPhotoSpecPage'))
const SocialMediaSizePage = lazy(() => import('./pages/SocialMediaSizePage'))
const BackgroundToolPage = lazy(() => import('./pages/BackgroundToolPage'))
const ConvertPage = lazy(() => import('./pages/ConvertPage'))

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

const contentRoutes = [
  { path: 'about', element: <LazyPage><AboutPage /></LazyPage> },
  { path: 'privacy', element: <LazyPage><PrivacyPage /></LazyPage> },
  { path: 'terms', element: <LazyPage><TermsPage /></LazyPage> },
  { path: 'contact', element: <LazyPage><ContactPage /></LazyPage> },
  { path: 'blog', element: <LazyPage><BlogListPage /></LazyPage> },
  { path: 'blog/:id', element: <LazyPage><BlogPostPage /></LazyPage> },
  { path: 'admin', element: <LazyPage><AdminPage /></LazyPage> },
  { path: 'id-photo-maker', element: <LazyPage><ToolIdPhotoPage /></LazyPage> },
  { path: 'background-remover', element: <LazyPage><ToolBackgroundRemoverPage /></LazyPage> },
  { path: 'photo-resizer', element: <LazyPage><ToolPhotoResizerPage /></LazyPage> },
  { path: 'photo-filter', element: <LazyPage><ToolPhotoFilterPage /></LazyPage> },
  { path: 'id-photo/:slug', element: <LazyPage><IdPhotoSpecPage /></LazyPage> },
  { path: 'resize/:slug', element: <LazyPage><SocialMediaSizePage /></LazyPage> },
  { path: 'background/:slug', element: <LazyPage><BackgroundToolPage /></LazyPage> },
  { path: 'convert/:slug', element: <LazyPage><ConvertPage /></LazyPage> },
]

const zhContentRoutes = contentRoutes.map((r) => ({
  ...r,
  path: `zh/${r.path}`,
}))

const router = createBrowserRouter([
  {
    element: (
      <SeoLangProvider>
        <Outlet />
      </SeoLangProvider>
    ),
    children: [
      { index: true, element: <App /> },
      ...contentRoutes,
      ...zhContentRoutes,
      { path: 'zh', element: <App /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
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
