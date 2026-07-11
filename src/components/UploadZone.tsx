import { useState, useCallback, useRef } from 'react'
import { UploadCloud } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { canvasManager } from '../lib/canvasManager'

export function UploadZone() {
  const { t } = useTranslation()
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      canvasManager.loadImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center p-8"
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div
        onClick={() => fileRef.current?.click()}
        className="magnetic flex cursor-pointer flex-col items-center justify-center rounded-2xl px-16 py-14 text-center"
        style={{
          background: dragging ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border-strong)'}`,
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ''
          }}
        />

        <div
          className="mb-4 flex items-center justify-center rounded-full"
          style={{
            width: 64,
            height: 64,
            background: 'var(--bg-tertiary)',
          }}
        >
          <UploadCloud size={30} style={{ color: 'var(--accent)' }} />
        </div>

        <h2 className="mb-1.5 text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
          {dragging ? t('upload.release') : t('upload.dragHere')}
        </h2>
        <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
          {t('upload.clickSelect')}
        </p>
      </div>
    </div>
  )
}
