/** Format bytes to human-readable string */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Download a data URL as a file. */
export function downloadDataURL(dataUrl: string, filename: string): void {
  // Convert data URL to Blob with application/octet-stream MIME type
  // so the browser triggers a "Save As" dialog instead of previewing.
  const byteString = atob(dataUrl.split(',')[1] || '')
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  // Use 'application/octet-stream' to force download, not inline preview
  const blob = new Blob([ab], { type: 'application/octet-stream' })
  const blobUrl = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()

  // Delay removal so the browser has time to initiate the download
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(blobUrl)
  }, 150)
}
