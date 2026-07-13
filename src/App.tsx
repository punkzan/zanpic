import { useEffect } from 'react'
import { useEditorStore } from './store/editorStore'
import { useBlogStore } from './store/blogStore'
import { useTheme } from './hooks/useTheme'
import { useDailyBackground } from './hooks/useDailyBackground'
import { useSeoMeta } from './hooks/useSeoMeta'
import { canvasManager } from './lib/canvasManager'
import { Toolbar } from './components/Toolbar'
import { EditorCanvas } from './components/EditorCanvas'
import { UploadZone } from './components/UploadZone'
import { ExportDialog } from './components/ExportDialog'
import { SidePanel } from './components/SidePanel'
import { CutoutOverlay } from './components/CutoutOverlay'
import { BrushPanel } from './components/BrushPanel'
import { IdPhotoOverlay } from './components/IdPhotoOverlay'
import { Footer } from './components/Footer'
import { PageModal } from './components/PageModal'

export default function App() {
  useTheme()
  useDailyBackground()
  useSeoMeta()
  const hasImage = useEditorStore((s) => s.hasImage)
  const exportOpen = useEditorStore((s) => s.exportOpen)
  const setExportOpen = useEditorStore((s) => s.setExportOpen)
  const shortcutsOpen = useEditorStore((s) => s.shortcutsOpen)
  const setShortcutsOpen = useEditorStore((s) => s.setShortcutsOpen)

  // DIAGNOSTIC: force blog store init and log state on mount
  const blogPosts = useBlogStore((s) => s.posts)
  useEffect(() => {
    console.warn('[ZanPic App Mount] blogStore posts count:', blogPosts.length)
  }, [blogPosts.length])

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      const ctrl = e.ctrlKey || e.metaKey

      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        canvasManager.undo()
      } else if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        canvasManager.redo()
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && !ctrl) {
        const canvas = canvasManager.getCanvas()
        const active = canvas?.getActiveObject()
        if (active) {
          canvas?.remove(active)
          canvas?.renderAll()
        }
      } else if (ctrl && e.key === 's') {
        e.preventDefault()
        setExportOpen(!exportOpen)
      } else if (ctrl && e.key === '/') {
        e.preventDefault()
        setShortcutsOpen(!shortcutsOpen)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [exportOpen, shortcutsOpen])

  return (
    <div className="flex h-full flex-col relative">
      <Toolbar />
      <main className="relative flex flex-1 overflow-hidden">
        <div className="relative flex flex-1 overflow-hidden">
          <EditorCanvas />
          {!hasImage && <UploadZone />}
        </div>
        <SidePanel />
      </main>
      {exportOpen && <ExportDialog />}
      <BrushPanel />
      <CutoutOverlay />
      <IdPhotoOverlay />
      <Footer />
      <PageModal />
    </div>
  )
}
