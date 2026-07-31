import { useState, useRef, useCallback, type DragEvent } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'
import { usePageMeta } from '../hooks/usePageMeta'
import { getConvertSpec, CONVERT_SPECS } from '../data/convert-specs'

export default function ConvertPage() {
  const { slug } = useParams<{ slug: string }>()
  const spec = slug ? getConvertSpec(slug) : undefined

  usePageMeta({
    title: spec ? `${spec.title} | Zan Pic` : '图片格式转换 | Zan Pic',
    description: spec
      ? `${spec.sourceFormat} 转 ${spec.targetFormat}：免费在线转换，浏览器本地处理，支持自定义压缩质量。${spec.intro.slice(0, 80)}`
      : '图片格式转换工具',
    path: `/convert/${slug || ''}`,
  })

  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string>('')
  const [originalSize, setOriginalSize] = useState(0)
  const [convertedUrl, setConvertedUrl] = useState<string>('')
  const [convertedSize, setConvertedSize] = useState(0)
  const [quality, setQuality] = useState(90)
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!spec) return
      setError('')
      setConvertedUrl('')
      setConvertedSize(0)

      // Validate source format
      const validTypes = [spec.sourceMime]
      // Also accept common variations
      if (spec.sourceMime === 'image/jpeg') validTypes.push('image/jpg')
      if (spec.sourceMime === 'image/bmp') validTypes.push('image/x-ms-bmp', 'image/x-bmp')

      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const sourceExt = spec.sourceExt.replace('.', '').toLowerCase()
      const isTypeMatch =
        validTypes.includes(file.type) || fileExt === sourceExt || file.type === ''

      if (!isTypeMatch) {
        setError(`请上传 ${spec.sourceFormat} 格式的图片（.${sourceExt}）`)
        return
      }

      setOriginalFile(file)
      setOriginalSize(file.size)
      const url = URL.createObjectURL(file)
      setOriginalUrl(url)
    },
    [spec],
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const convert = useCallback(async () => {
    if (!originalFile || !spec) return

    setConverting(true)
    setError('')

    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = originalUrl

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('图片加载失败'))
      })

      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!

      // For JPG output with transparent source, fill background
      if (spec.targetMime === 'image/jpeg') {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)

      // Convert
      const mime = spec.targetMime
      const qualityVal = mime === 'image/jpeg' || mime === 'image/webp' ? quality / 100 : undefined

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('转换失败，请尝试其他图片')
            setConverting(false)
            return
          }
          setConvertedSize(blob.size)
          setConvertedUrl(URL.createObjectURL(blob))
          setConverting(false)
        },
        mime,
        qualityVal,
      )
    } catch {
      setError('图片处理失败，请确保文件未损坏')
      setConverting(false)
    }
  }, [originalFile, originalUrl, spec, quality, bgColor])

  const download = useCallback(() => {
    if (!convertedUrl || !spec || !originalFile) return
    const a = document.createElement('a')
    a.href = convertedUrl
    const baseName = originalFile.name.replace(/\.[^.]+$/, '')
    a.download = `${baseName}${spec.targetExt}`
    a.click()
  }, [convertedUrl, spec, originalFile])

  const reset = useCallback(() => {
    setOriginalFile(null)
    setOriginalUrl('')
    setOriginalSize(0)
    setConvertedUrl('')
    setConvertedSize(0)
    setError('')
  }, [])

  if (!spec) {
    return <Navigate to="/photo-resizer" replace />
  }

  const relatedSpecs = CONVERT_SPECS.filter((s) => s.slug !== spec.slug).slice(0, 6)
  const sizeDiff = convertedSize > 0 ? ((originalSize - convertedSize) / originalSize) * 100 : 0

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const showQualitySlider = spec.targetMime === 'image/jpeg' || spec.targetMime === 'image/webp'
  const showBgColorPicker =
    (spec.sourceMime === 'image/png' || spec.sourceMime === 'image/webp' || spec.sourceMime === 'image/gif') &&
    spec.targetMime === 'image/jpeg'

  return (
    <ContentLayout>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
        <Link to="/" style={{ color: 'var(--accent)' }}>
          首页
        </Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>
          {spec.sourceFormat} 转 {spec.targetFormat}
        </span>
      </nav>

      <h1
        style={{
          fontSize: '26px',
          fontWeight: 700,
          marginBottom: '8px',
          color: 'var(--text-primary)',
          lineHeight: 1.3,
        }}
      >
        {spec.title}
      </h1>
      <p
        style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginBottom: '28px',
          lineHeight: 1.7,
        }}
      >
        {spec.intro}
      </p>

      {/* Converter Tool */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid var(--border-light)',
          marginBottom: '36px',
        }}
      >
        {!originalFile ? (
          /* Upload area */
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border-light)'}`,
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
              background: dragOver ? 'var(--bg-tertiary)' : 'transparent',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📁</div>
            <p style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}>
              拖拽 {spec.sourceFormat} 图片到此处，或点击上传
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
              支持 {spec.sourceExt} 格式，浏览器本地处理，图片不上传服务器
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={`${spec.sourceMime},.${spec.sourceExt.replace('.', '')}`}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          /* Preview & Convert */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                📄 {originalFile.name} ({formatBytes(originalSize)})
              </span>
              <button
                onClick={reset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  padding: '4px 8px',
                }}
              >
                重新上传
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              {/* Original */}
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '8px', fontWeight: 600 }}>
                  原图 ({spec.sourceFormat})
                </p>
                <div
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    padding: '8px',
                    minHeight: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={originalUrl}
                    alt={`原始 ${spec.sourceFormat} 图片`}
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                  />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  {formatBytes(originalSize)}
                </p>
              </div>

              {/* Converted */}
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '8px', fontWeight: 600 }}>
                  转换后 ({spec.targetFormat})
                </p>
                <div
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    padding: '8px',
                    minHeight: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {convertedUrl ? (
                    <img
                      src={convertedUrl}
                      alt={`转换后 ${spec.targetFormat} 图片`}
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                    />
                  ) : (
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
                      {converting ? '转换中…' : '点击下方按钮开始转换'}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  {convertedSize > 0 ? (
                    <>
                      {formatBytes(convertedSize)}
                      {sizeDiff > 0 && (
                        <span style={{ color: '#16a34a', marginLeft: '6px' }}>(↓{sizeDiff.toFixed(1)}%)</span>
                      )}
                      {sizeDiff < 0 && (
                        <span style={{ color: '#dc2626', marginLeft: '6px' }}>(↑{Math.abs(sizeDiff).toFixed(1)}%)</span>
                      )}
                    </>
                  ) : (
                    '—'
                  )}
                </p>
              </div>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              {showQualitySlider && (
                <div style={{ flex: '1 1 200px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    压缩质量: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => {
                      setQuality(Number(e.target.value))
                      setConvertedUrl('')
                      setConvertedSize(0)
                    }}
                    style={{ width: '100%' }}
                  />
                </div>
              )}
              {showBgColorPicker && (
                <div style={{ flex: '0 0 auto' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px',
                    }}
                  >
                    背景填充色
                  </label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => {
                      setBgColor(e.target.value)
                      setConvertedUrl('')
                      setConvertedSize(0)
                    }}
                    style={{ width: '48px', height: '32px', border: '1px solid var(--border-light)', borderRadius: '6px', cursor: 'pointer' }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={convert}
                disabled={converting}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: converting ? 'var(--bg-tertiary)' : 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: converting ? 'not-allowed' : 'pointer',
                }}
              >
                {converting ? '转换中…' : `转换为 ${spec.targetFormat}`}
              </button>
              {convertedUrl && (
                <button
                  onClick={download}
                  style={{
                    padding: '12px 24px',
                    background: 'none',
                    color: 'var(--accent)',
                    border: '2px solid var(--accent)',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  ⬇ 下载
                </button>
              )}
            </div>

            {error && (
              <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Format Comparison */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
        {spec.sourceFormat} vs {spec.targetFormat} 格式对比
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {/* Source format */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid var(--border-light)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
            {spec.sourceFormat}
          </h3>
          <p style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600, marginBottom: '6px' }}>优点</p>
          <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px', marginBottom: '12px' }}>
            {spec.sourcePros.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p style={{ fontSize: '13px', color: '#dc2626', fontWeight: 600, marginBottom: '6px' }}>缺点</p>
          <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px' }}>
            {spec.sourceCons.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        {/* Target format */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid var(--accent)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent)' }}>
            {spec.targetFormat}
          </h3>
          <p style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600, marginBottom: '6px' }}>优点</p>
          <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px', marginBottom: '12px' }}>
            {spec.targetPros.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p style={{ fontSize: '13px', color: '#dc2626', fontWeight: 600, marginBottom: '6px' }}>缺点</p>
          <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px' }}>
            {spec.targetCons.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Common Uses */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        常见使用场景
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
        {spec.commonUses.map((use) => (
          <span
            key={use}
            style={{
              padding: '6px 12px',
              background: 'var(--bg-secondary)',
              borderRadius: '20px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-light)',
            }}
          >
            {use}
          </span>
        ))}
      </div>

      {/* Tips */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        转换技巧
      </h2>
      <ul style={{ marginBottom: '32px', color: 'var(--text-secondary)', lineHeight: 1.9, paddingLeft: '20px' }}>
        {spec.tips.map((tip) => (
          <li key={tip} style={{ marginBottom: '6px' }}>
            {tip}
          </li>
        ))}
      </ul>

      {/* How to convert */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
        如何将 {spec.sourceFormat} 转为 {spec.targetFormat}
      </h2>
      <div style={{ display: 'grid', gap: '10px', marginBottom: '32px' }}>
        {[
          { step: '1', title: '上传图片', desc: `将 ${spec.sourceFormat} 图片拖拽到上方上传区域，或点击选择文件。` },
          { step: '2', title: '调整参数', desc: showQualitySlider ? '根据需要调整压缩质量，PNG 和 BMP 转换无需设置。' : '无需额外设置，直接进行下一步。' },
          { step: '3', title: '开始转换', desc: `点击「转换为 ${spec.targetFormat}」按钮，浏览器自动完成格式转换。` },
          { step: '4', title: '下载结果', desc: `转换完成后点击「下载」按钮，保存 ${spec.targetExt} 文件到本地。` },
        ].map((item) => (
          <div
            key={item.step}
            style={{
              display: 'flex',
              gap: '14px',
              padding: '12px 14px',
              background: 'var(--bg-secondary)',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--accent)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {item.step}
            </span>
            <div>
              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{item.title}</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '3px 0 0' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
        常见问题
      </h2>
      <div style={{ marginBottom: '32px' }}>
        {spec.faq.map((item, i) => (
          <div
            key={i}
            style={{
              marginBottom: '10px',
              padding: '12px 14px',
              background: 'var(--bg-secondary)',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
            }}
          >
            <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{item.q}</strong>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '6px 0 0', lineHeight: 1.7 }}>{item.a}</p>
          </div>
        ))}
      </div>

      {/* Related conversions */}
      <h2 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
        其他格式转换
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', marginBottom: '40px' }}>
        {relatedSpecs.map((s) => (
          <Link
            key={s.slug}
            to={`/convert/${s.slug}`}
            style={{
              display: 'block',
              padding: '10px 14px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
          >
            {s.sourceFormat} → {s.targetFormat}
          </Link>
        ))}
      </div>
    </ContentLayout>
  )
}
