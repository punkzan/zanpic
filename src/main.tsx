import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'

const AdminPage = lazy(() => import('./pages/AdminPage'))

function Root() {
  const isAdmin = window.location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <Suspense fallback={<div className="admin-loading">Loading…</div>}>
        <AdminPage />
      </Suspense>
    )  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
