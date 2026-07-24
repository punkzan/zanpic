/**
 * File import utility for BlogEditor.
 *
 * Supports:
 * - .md / .txt  → read as text directly
 * - .docx       → mammoth.js → HTML → turndown → Markdown
 * - .html       → turndown → Markdown
 *
 * All processing happens in the browser — no server upload.
 */

import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'

// ── Lazy-loaded mammoth (only when a .docx is imported) ──
// Vite resolves the `browser` field in mammoth's package.json automatically,
// swapping in browser-compatible unzip and file-reader modules.
type MammothModule = typeof import('mammoth')
let _mammoth: MammothModule | null = null
async function getMammoth(): Promise<MammothModule> {
  if (!_mammoth) {
    _mammoth = await import('mammoth')
  }
  return _mammoth
}

// ── Shared turndown instance ──
let _turndown: TurndownService | null = null
function getTurndown(): TurndownService {
  if (!_turndown) {
    _turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '*',
      strongDelimiter: '**',
      linkStyle: 'inlined',
    })
    _turndown.use(gfm)
    // Preserve <br> tags as markdown line breaks
    _turndown.addRule('linebreak', {
      filter: 'br',
      replacement: (_content, node) => {
        return (node as HTMLElement).parentElement?.tagName === 'P'
          ? '  \n'
          : '\n'
      },
    })
  }
  return _turndown
}

export interface ImportResult {
  /** Extracted Markdown content */
  content: string
  /** Suggested title (from first heading or filename, if available) */
  title?: string
}

/**
 * Convert HTML to Markdown using turndown.
 */
function htmlToMarkdown(html: string): string {
  const td = getTurndown()
  return td.turndown(html).trim()
}

/**
 * Extract a title from the first H1/H2 heading in Markdown.
 * Removes the leading # markers.
 */
function extractTitleFromMarkdown(md: string): string | undefined {
  const match = md.match(/^#{1,2}\s+(.+)$/m)
  if (match) {
    return match[1].trim()
  }
  return undefined
}

/**
 * Read a File as text (UTF-8).
 */
function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file, 'utf-8')
  })
}

/**
 * Read a File as ArrayBuffer.
 */
function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Get file extension (lowercase, without dot).
 */
function getExt(filename: string): string {
  const idx = filename.lastIndexOf('.')
  return idx >= 0 ? filename.slice(idx + 1).toLowerCase() : ''
}

/**
 * Derive a title from filename (strip extension, replace separators).
 */
function titleFromFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '')
  return base.replace(/[_-]+/g, ' ').trim()
}

/**
 * Import a file and convert it to Markdown.
 *
 * @param file  The File object from <input type="file"> or drag-drop
 * @returns     ImportResult with content and optional title
 * @throws      Error if the file type is unsupported or parsing fails
 */
export async function importFile(file: File): Promise<ImportResult> {
  const ext = getExt(file.name)

  switch (ext) {
    case 'md':
    case 'txt':
    case 'markdown': {
      const text = await readAsText(file)
      return {
        content: text.trim(),
        title: extractTitleFromMarkdown(text) ?? titleFromFilename(file.name),
      }
    }

    case 'docx': {
      try {
        const arrayBuffer = await readAsArrayBuffer(file)
        const mammoth = await getMammoth()
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            styleMap: [
              "p[style-name='Title'] => h1:fresh",
              "p[style-name='Subtitle'] => h2:fresh",
              "p[style-name='Heading 1'] => h1:fresh",
              "p[style-name='Heading 2'] => h2:fresh",
              "p[style-name='Heading 3'] => h3:fresh",
            ],
          },
        )
        const html = result.value
        const markdown = htmlToMarkdown(html)
        return {
          content: markdown,
          title: extractTitleFromMarkdown(markdown) ?? titleFromFilename(file.name),
        }
      } catch (err) {
        throw new Error(
          `DOCX parsing failed: ${err instanceof Error ? err.message : String(err)}`,
        )
      }
    }

    case 'html':
    case 'htm': {
      const html = await readAsText(file)
      const markdown = htmlToMarkdown(html)
      return {
        content: markdown,
        title: extractTitleFromMarkdown(markdown) ?? titleFromFilename(file.name),
      }
    }

    default:
      throw new Error(
        `Unsupported file type ".${ext}". Supported formats: .md, .txt, .docx, .html`,
      )
  }
}

/**
 * Check if a file type is supported for import.
 */
export function isSupportedFile(file: File): boolean {
  const ext = getExt(file.name)
  return ['md', 'txt', 'markdown', 'docx', 'html', 'htm'].includes(ext)
}

/**
 * Accepted file types string for <input accept="...">.
 */
export const ACCEPTED_TYPES = '.md,.txt,.markdown,.docx,.html,.htm'
