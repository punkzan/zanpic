import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { Upload, Undo2, Redo2, Trash2, Download, Image as ImageIcon, SlidersHorizontal, Sparkles, Crop, Wand2, Brush, ContactRound, Keyboard, X, Wrench, FileDown, FileImage, Type } from 'lucide-react'
import { useEditorStore, type PanelType } from '../store/editorStore'
import { canvasManager } from '../lib/canvasManager'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import { WatermarkDialog } from './WatermarkDialog'
import { CompressDialog } from './CompressDialog'
import { FormatConvertDialog } from './FormatConvertDialog'

export function Toolbar() {
  const fileRef = useRef<HTMLInputElement>(null)
  const cutoutRef = useRef<HTMLDivElement>(null)
  const toolsRef = useRef<HTMLDivElement>(null)
  const [cutoutMenuOpen, setCutoutMenuOpen] = useState(false)
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false)
  const [watermarkOpen, setWatermarkOpen] = useState(false)
  const [compressOpen, setCompressOpen] = useState(false)
  const [formatOpen, setFormatOpen] = useState(false)
  const shortcutsOpen = useEditorStore((s) => s.shortcutsOpen)
  const setShortcutsOpen = useEditorStore((s) => s.setShortcutsOpen)
  const hasImage = useEditorStore((s) => s.hasImage)
  const canUndo = useEditorStore((s) => s.canUndo)
  const canRedo = useEditorStore((s) => s.canRedo)
  const setExportOpen = useEditorStore((s) => s.setExportOpen)
  const activePanel = useEditorStore((s) => s.activePanel)
  const setActivePanel = useEditorStore((s) => s.setActivePanel)
  const setCutout = useEditorStore((s) => s.setCutout)
  const setBrushActive = useEditorStore((s) => s.setBrushActive)
  const { t } = useTranslation()

  // Close cutout menu on outside click
  useEffect(() => {
    if (!cutoutMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (cutoutRef.current && !cutoutRef.current.contains(e.target as Node)) {
        setCutoutMenuOpen(false)
      }
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [cutoutMenuOpen])

  // Close tools menu on outside click
  useEffect(() => {
    if (!toolsMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsMenuOpen(false)
      }
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [toolsMenuOpen])

  const togglePanel = (panel: PanelType) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  const handleRemoveBackground = async () => {
    setCutout({ active: true, phase: 'download', progress: 0, message: t('toolbar.aiPreparing') })
    const success = await canvasManager.removeBackground((phase, progress, message) => {
      setCutout({ phase, progress, message })
    })
    if (success) {
      setCutout({ active: false, phase: 'done', progress: 100, message: t('toolbar.aiDone') })
    } else {
      setCutout({ active: false, phase: 'error', progress: 0, message: t('toolbar.aiFailed') })
    }
  }

  const handleBrushCutout = () => {
    const ok = canvasManager.enterBrushMode()
    if (ok) {
      setBrushActive(true)
    } else {
      console.error('[Toolbar] Failed to enter brush mode')
      // Show a brief error message via the cutout overlay
      setCutout({ active: true, phase: 'error', progress: 0, message: t('toolbar.brushFailed') })
      setTimeout(() => setCutout({ active: false, phase: 'idle', progress: 0, message: '' }), 2000)
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    loadImageFile(file)
    e.target.value = ''
  }

  const loadImageFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      canvasManager.loadImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <header
      className="glass flex items-center justify-between px-5"
      style={{ height: 64, borderBottom: '1px solid var(--border-color)', position: 'relative', zIndex: 50 }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 36,
            height: 36,
            background: 'var(--accent)',
          }}
        >
          <ImageIcon size={20} color="#fff" strokeWidth={2.2} />
        </div>
        <span className="text-[17px] font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Zan Pic
        </span>
      </div>

      {/* Center actions */}
      <div className="flex items-center gap-1">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        <ToolbarButton onClick={() => fileRef.current?.click()} icon={<Upload size={18} />} label={t('toolbar.import')} />

        <Divider />

        <ToolbarButton
          onClick={() => canvasManager.undo()}
          icon={<Undo2 size={18} />}
          label={t('toolbar.undo')}
          disabled={!canUndo}
          shortcut="Ctrl+Z"
        />
        <ToolbarButton
          onClick={() => canvasManager.redo()}
          icon={<Redo2 size={18} />}
          label={t('toolbar.redo')}
          disabled={!canRedo}
          shortcut="Ctrl+Y"
        />

        <Divider />

        <ToolbarButton
          onClick={() => canvasManager.clearAll()}
          icon={<Trash2 size={18} />}
          label={t('toolbar.clear')}
          disabled={!hasImage}
        />
        <ToolbarButton
          onClick={() => togglePanel('adjust')}
          icon={<SlidersHorizontal size={18} />}
          label={t('toolbar.adjust')}
          disabled={!hasImage}
          active={activePanel === 'adjust'}
        />
        <ToolbarButton
          onClick={() => togglePanel('filter')}
          icon={<Sparkles size={18} />}
          label={t('toolbar.filter')}
          disabled={!hasImage}
          active={activePanel === 'filter'}
        />
        <ToolbarButton
          onClick={() => togglePanel('crop')}
          icon={<Crop size={18} />}
          label={t('toolbar.crop')}
          disabled={!hasImage}
          active={activePanel === 'crop'}
        />
        {/* Cutout dropdown */}
        <div ref={cutoutRef} className="relative">
          <ToolbarButton
            onClick={() => setCutoutMenuOpen(!cutoutMenuOpen)}
            icon={<Wand2 size={18} />}
            label={t('toolbar.cutout')}
            disabled={!hasImage}
            active={cutoutMenuOpen}
          />
          {cutoutMenuOpen && (
            <div
              className="absolute top-full right-0 mt-1 min-w-[160px] overflow-hidden rounded-xl py-1 shadow-2xl"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(20px) saturate(180%)',
                animation: 'dropIn 0.15s ease-out',
              }}
            >
              <button
                onClick={() => {
                  setCutoutMenuOpen(false)
                  handleRemoveBackground()
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <Wand2 size={16} style={{ color: 'var(--accent)' }} />
                <div>
                  <div className="font-medium">{t('toolbar.smartCutout')}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{t('toolbar.smartCutoutDesc')}</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setCutoutMenuOpen(false)
                  handleBrushCutout()
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <Brush size={16} style={{ color: '#22c55e' }} />
                <div>
                  <div className="font-medium">{t('toolbar.brushCutout')}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{t('toolbar.brushCutoutDesc')}</div>
                </div>
              </button>
            </div>
          )}
        </div>
        {/* Tools dropdown */}
        <div ref={toolsRef} className="relative">
          <ToolbarButton
            onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
            icon={<Wrench size={18} />}
            label={t('toolbar.tools')}
            disabled={!hasImage}
            active={toolsMenuOpen}
          />
          {toolsMenuOpen && (
            <div
              className="absolute top-full right-0 mt-1 min-w-[170px] overflow-hidden rounded-xl py-1 shadow-2xl"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(20px) saturate(180%)',
                animation: 'dropIn 0.15s ease-out',
              }}
            >
              <button
                onClick={() => {
                  setToolsMenuOpen(false)
                  setWatermarkOpen(true)
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <Type size={16} style={{ color: 'var(--accent)' }} />
                <div>
                  <div className="font-medium">{t('toolbar.watermark')}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{t('toolbar.watermarkDesc')}</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setToolsMenuOpen(false)
                  setCompressOpen(true)
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <FileDown size={16} style={{ color: '#f59e0b' }} />
                <div>
                  <div className="font-medium">{t('toolbar.compress')}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{t('toolbar.compressDesc')}</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setToolsMenuOpen(false)
                  setFormatOpen(true)
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] transition-colors"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <FileImage size={16} style={{ color: '#8b5cf6' }} />
                <div>
                  <div className="font-medium">{t('toolbar.convert')}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{t('toolbar.convertDesc')}</div>
                </div>
              </button>
            </div>
          )}
        </div>
        <ToolbarButton
          onClick={() => togglePanel('idphoto')}
          icon={<ContactRound size={18} />}
          label={t('toolbar.idphoto')}
          disabled={!hasImage}
          active={activePanel === 'idphoto'}
        />
        <ToolbarButton
          onClick={() => setExportOpen(true)}
          icon={<Download size={18} />}
          label={t('toolbar.export')}
          disabled={!hasImage}
          primary
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setShortcutsOpen(true)}
          className="magnetic flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          title={t('toolbar.shortcuts')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-tertiary)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <Keyboard size={16} />
          <span className="hidden sm:inline">{t('toolbar.shortcuts')}</span>
        </button>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Shortcuts reference panel — portal to body to escape backdrop-filter clipping */}
      {shortcutsOpen && createPortal(
        <ShortcutsPanel onClose={() => setShortcutsOpen(false)} />,
        document.body,
      )}

      {/* Tool dialogs */}
      {watermarkOpen && <WatermarkDialog onClose={() => setWatermarkOpen(false)} />}
      {compressOpen && <CompressDialog onClose={() => setCompressOpen(false)} />}
      {formatOpen && <FormatConvertDialog onClose={() => setFormatOpen(false)} />}
    </header>
  )
}

function ToolbarButton({
  onClick,
  icon,
  label,
  disabled,
  primary,
  active,
  shortcut,
}: {
  onClick: () => void
  icon: React.ReactNode
  label: string
  disabled?: boolean
  primary?: boolean
  active?: boolean
  shortcut?: string
}) {
  const title = shortcut ? `${label} (${shortcut})` : label
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="magnetic flex items-center gap-2 rounded-lg px-4 py-2 text-[15px] font-medium disabled:opacity-35 disabled:cursor-not-allowed"
      style={{
        background: primary
          ? 'var(--accent)'
          : active
            ? 'var(--accent-bg)'
            : 'transparent',
        color: primary
          ? '#fff'
          : active
            ? 'var(--accent)'
            : 'var(--text-secondary)',
      }}
      onMouseEnter={(e) => {
        if (disabled) return
        if (primary) {
          e.currentTarget.style.background = 'var(--accent-hover)'
        } else if (active) {
          e.currentTarget.style.background = 'var(--bg-tertiary)'
        } else {
          e.currentTarget.style.background = 'var(--bg-tertiary)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }
      }}
      onMouseLeave={(e) => {
        if (disabled) return
        if (primary) {
          e.currentTarget.style.background = 'var(--accent)'
        } else if (active) {
          e.currentTarget.style.background = 'var(--accent-bg)'
          e.currentTarget.style.color = 'var(--accent)'
        } else {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {shortcut && (
        <kbd className="shortcut-badge hidden sm:inline-flex">{shortcut}</kbd>
      )}
    </button>
  )
}

function Divider() {
  return (
    <div
      className="mx-1.5 h-5 w-px"
      style={{ background: 'var(--border-color)' }}
    />
  )
}

// ── Keyboard shortcuts definitions ──

interface ShortcutGroup {
  title: string
  shortcuts: { label: string; keys: string[] }[]
}

function ShortcutsPanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()

  const SHORTCUT_GROUPS: ShortcutGroup[] = [
    {
      title: t('shortcuts.global'),
      shortcuts: [
        { label: t('shortcuts.undo'), keys: ['Ctrl', 'Z'] },
        { label: t('shortcuts.redo'), keys: ['Ctrl', 'Y'] },
        { label: t('shortcuts.redoAlt'), keys: ['Ctrl', 'Shift', 'Z'] },
        { label: t('shortcuts.deleteObject'), keys: ['Delete'] },
        { label: t('shortcuts.exportImage'), keys: ['Ctrl', 'S'] },
        { label: t('shortcuts.shortcutRef'), keys: ['Ctrl', '/'] },
      ],
    },
    {
      title: t('shortcuts.cropMode'),
      shortcuts: [
        { label: t('shortcuts.confirmCrop'), keys: ['Enter'] },
        { label: t('shortcuts.cancelCrop'), keys: ['Esc'] },
      ],
    },
    {
      title: t('shortcuts.brushMode'),
      shortcuts: [
        { label: t('shortcuts.keepBrush'), keys: ['1'] },
        { label: t('shortcuts.eraseBrush'), keys: ['2'] },
        { label: t('shortcuts.eraser'), keys: ['3'] },
        { label: t('shortcuts.shrinkBrush'), keys: ['['] },
        { label: t('shortcuts.enlargeBrush'), keys: [']'] },
        { label: t('shortcuts.applyCutout'), keys: ['Enter'] },
        { label: t('shortcuts.cancel'), keys: ['Esc'] },
      ],
    },
  ]

  // Close on Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div className="shortcuts-backdrop" onClick={onClose} />

      {/* Panel — stop clicks from bubbling to backdrop */}
      <div className="shortcuts-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Keyboard size={22} style={{ color: 'var(--accent)' }} />
            <h2 className="text-[17px] font-semibold" style={{ color: 'var(--text-primary)' }}>
              {t('shortcuts.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-tertiary)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Groups */}
        {SHORTCUT_GROUPS.map((group) => (
          <div key={group.title} className="mb-5 last:mb-0">
            <h3
              className="mb-2 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {group.title}
            </h3>
            <div
              className="overflow-hidden rounded-xl"
              style={{ border: '1px solid var(--border-color)' }}
            >
              {group.shortcuts.map((item, i) => (
                <div
                  key={i}
                  className="shortcut-row px-3.5"
                >
                  <span className="text-[13px]" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </span>
                  <div className="shortcut-keys">
                    {item.keys.map((key, j) => (
                      <span key={j}>
                        <kbd className={key.length > 1 || key === 'Ctrl' || key === 'Shift' || key === 'Alt' ? 'mod' : ''}>
                          {key === 'Ctrl' ? '⌃' : key === 'Shift' ? '⇧' : key === 'Alt' ? '⌥' : key === 'Delete' ? '⌫' : key}
                        </kbd>
                        {j < item.keys.length - 1 && (
                          <span className="mx-0.5 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Hint */}
        <p className="mt-3 text-[11px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          {t('shortcuts.macHint')}
        </p>
      </div>
    </>
  )
}
