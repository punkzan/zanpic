import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import * as fabric from 'fabric'
import { X, Type, ImageIcon, Upload, Check, RotateCcw } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { canvasManager } from '../lib/canvasManager'

type WmType = 'text' | 'image'
type Position = 'tl' | 'tc' | 'tr' | 'center' | 'bl' | 'bc' | 'br' | 'tile'

const POSITION_KEYS: Position[] = ['tl', 'tc', 'tr', 'center', 'bl', 'bc', 'br', 'tile']

export function WatermarkDialog({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const hasImage = useEditorStore((s) => s.hasImage)
  const [wtype, setWtype] = useState<WmType>('text')
  const [applied, setApplied] = useState(false)

  // Text state
  const [text, setText] = useState('Zan Pic')
  const [fontSize, setFontSize] = useState(32)
  const [fontColor, setFontColor] = useState('#ffffff')
  const [textOpacity, setTextOpacity] = useState(0.3)
  const [textRotation, setTextRotation] = useState(-25)
  const [textPosition, setTextPosition] = useState<Position>('center')

  // Image state
  const fileRef = useRef<HTMLInputElement>(null)
  const [imgDataUrl, setImgDataUrl] = useState<string | null>(null)
  const [imgScale, setImgScale] = useState(0.12)
  const [imgOpacity, setImgOpacity] = useState(0.4)
  const [imgPosition, setImgPosition] = useState<Position>('br')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImgDataUrl(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const apply = async () => {
    const canvas = canvasManager.getCanvas()
    if (!canvas) return

    if (wtype === 'text') {
      const wm = new fabric.FabricText(text, {
        fontSize,
        fill: fontColor,
        opacity: textOpacity,
        angle: textRotation,
        originX: 'center',
        originY: 'center',
        selectable: true,
        evented: true,
      })
      setPositionOnCanvas(wm, textPosition, canvas)
      canvas.add(wm)
    } else {
      if (!imgDataUrl) return
      try {
        const img = await fabric.FabricImage.fromURL(imgDataUrl, { crossOrigin: 'anonymous' })
        const size = canvasManager.getCanvasSize()
        if (size) {
          const maxDim = Math.min(size.width, size.height) * imgScale
          const s = maxDim / Math.max(img.width || 1, img.height || 1)
          img.scale(s)
        }
        img.set({
          opacity: imgOpacity,
          selectable: true,
          evented: true,
        })
        setPositionOnCanvas(img, imgPosition, canvas)
        canvas.add(img)
      } catch (err) {
        console.error('[Watermark] image load failed:', err)
        return
      }
    }

    canvas.renderAll()
    setApplied(true)

    // Auto-close after short feedback
    setTimeout(() => {
      onClose()
    }, 600)
  }

  function setPositionOnCanvas(
    obj: fabric.FabricObject,
    pos: Position,
    canvas: fabric.Canvas,
  ) {
    const cw = canvas.getWidth()
    const ch = canvas.getHeight()
    const w = obj.width || 0
    const h = obj.height || 0
    const pad = 24

    switch (pos) {
      case 'tl': obj.set({ left: pad + w / 2, top: pad + h / 2 }); break
      case 'tc': obj.set({ left: cw / 2, top: pad + h / 2 }); break
      case 'tr': obj.set({ left: cw - pad - w / 2, top: pad + h / 2 }); break
      case 'center': obj.set({ left: cw / 2, top: ch / 2 }); break
      case 'bl': obj.set({ left: pad + w / 2, top: ch - pad - h / 2 }); break
      case 'bc': obj.set({ left: cw / 2, top: ch - pad - h / 2 }); break
      case 'br': obj.set({ left: cw - pad - w / 2, top: ch - pad - h / 2 }); break
      case 'tile': {
        // Single centered with large size for tile-like feel
        obj.set({ left: cw / 2, top: ch / 2 })
        break
      }
    }
  }

  if (!hasImage) {
    return (
      <DialogShell onClose={onClose} title={t('watermark.title')}>
        <p className="text-center py-8 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
          {t('watermark.pleaseImport')}
        </p>
      </DialogShell>
    )
  }

  return (
    <DialogShell onClose={onClose} title={t('watermark.customTitle')}>
      {/* Type toggle */}
      <div className="flex gap-2 mb-5">
        {([
          { key: 'text' as WmType, label: t('watermark.textType'), icon: Type },
          { key: 'image' as WmType, label: t('watermark.imageType'), icon: ImageIcon },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setWtype(key)}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-[14px] font-medium transition-colors"
            style={{
              background: wtype === key ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: wtype === key ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {wtype === 'text' ? (
        <>
          {/* Text input */}
          <label className="block mb-1.5 text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{t('watermark.text')}</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-[14px] mb-4"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
              outline: 'none',
            }}
          />

          {/* Font size + Rotation */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block mb-1 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{t('watermark.fontSize')} {fontSize}px</label>
              <input
                type="range" min={12} max={120} value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full" style={{ accentColor: 'var(--accent)' }}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{t('watermark.rotation')} {textRotation}°</label>
              <input
                type="range" min={-90} max={90} value={textRotation}
                onChange={(e) => setTextRotation(Number(e.target.value))}
                className="w-full" style={{ accentColor: 'var(--accent)' }}
              />
            </div>
          </div>

          {/* Color + Opacity */}
          <div className="flex gap-3 mb-4">
            <div>
              <label className="block mb-1 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{t('watermark.color')}</label>
              <input
                type="color" value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="h-8 w-10 rounded cursor-pointer border-0"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{t('watermark.opacity')} {Math.round(textOpacity * 100)}%</label>
              <input
                type="range" min={0.05} max={1} step={0.01} value={textOpacity}
                onChange={(e) => setTextOpacity(Number(e.target.value))}
                className="w-full" style={{ accentColor: 'var(--accent)' }}
              />
            </div>
          </div>

          {/* Position */}
          <PosPicker selected={textPosition} onChange={setTextPosition} />
        </>
      ) : (
        <>
          {/* Image upload */}
          <label className="block mb-1.5 text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{t('watermark.image')}</label>
          <input ref={fileRef} type="file" accept="image/png,image/svg+xml" className="hidden" onChange={handleFile} />
          {imgDataUrl ? (
            <div className="mb-4 flex items-center gap-3 rounded-lg p-3" style={{ background: 'var(--bg-tertiary)' }}>
              <img src={imgDataUrl} alt="watermark preview" className="h-12 max-w-[80px] rounded object-contain" style={{ background: '#333' }} />
              <div className="flex-1 min-w-0">
                <span className="text-[13px] block truncate" style={{ color: 'var(--text-primary)' }}>{t('watermark.selected')}</span>
                <button
                  onClick={() => { fileRef.current?.click() }}
                  className="text-[12px] mt-0.5"
                  style={{ color: 'var(--accent)' }}
                >
                  {t('watermark.changeImage')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full mb-4 flex flex-col items-center gap-2 rounded-lg py-6 border-2 border-dashed transition-colors"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
            >
              <Upload size={24} />
              <span className="text-[13px]">{t('watermark.uploadHint')}</span>
            </button>
          )}

          {/* Scale + Opacity */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block mb-1 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{t('watermark.scale')} {Math.round(imgScale * 100)}%</label>
              <input
                type="range" min={0.03} max={0.5} step={0.01} value={imgScale}
                onChange={(e) => setImgScale(Number(e.target.value))}
                className="w-full" style={{ accentColor: 'var(--accent)' }}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{t('watermark.opacity')} {Math.round(imgOpacity * 100)}%</label>
              <input
                type="range" min={0.05} max={1} step={0.01} value={imgOpacity}
                onChange={(e) => setImgOpacity(Number(e.target.value))}
                className="w-full" style={{ accentColor: 'var(--accent)' }}
              />
            </div>
          </div>

          {/* Position */}
          <PosPicker selected={imgPosition} onChange={setImgPosition} />
        </>
      )}

      {/* Action buttons */}
      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg py-3 text-[14px] font-medium transition-colors"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
        >
          {t('watermark.cancel')}
        </button>
        <button
          onClick={apply}
          disabled={wtype === 'image' && !imgDataUrl}
          className="magnetic flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-[15px] font-semibold transition-all duration-200 disabled:opacity-40"
          style={{ background: applied ? '#16a34a' : 'var(--accent)', color: '#fff' }}
        >
          {applied ? <Check size={18} /> : <RotateCcw size={18} />}
          {applied ? t('watermark.applied') : t('watermark.apply')}
        </button>
      </div>
    </DialogShell>
  )
}

function PosPicker({ selected, onChange }: { selected: Position; onChange: (p: Position) => void }) {
  const { t } = useTranslation()
  const positionLabels: Record<Position, string> = {
    tl: t('watermark.pos_tl'),
    tc: t('watermark.pos_tc'),
    tr: t('watermark.pos_tr'),
    center: t('watermark.pos_cc'),
    bl: t('watermark.pos_bl'),
    bc: t('watermark.pos_bc'),
    br: t('watermark.pos_br'),
    tile: t('watermark.pos_tile'),
  }
  return (
    <div>
      <label className="block mb-1.5 text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{t('watermark.position')}</label>
      <div className="grid grid-cols-4 gap-1">
        {POSITION_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="rounded-lg py-1.5 text-[12px] font-medium transition-colors"
            style={{
              background: selected === key ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: selected === key ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {positionLabels[key]}
          </button>
        ))}
      </div>
    </div>
  )
}

function DialogShell({
  onClose,
  title,
  children,
}: {
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  // Esc to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="glass relative w-[460px] rounded-2xl p-6 max-h-[88vh] overflow-y-auto"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <X size={17} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
