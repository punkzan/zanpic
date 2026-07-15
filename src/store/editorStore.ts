import { create } from 'zustand'

export type Theme = 'light' | 'dark'
export type Tool = 'select' | 'move'
export type PanelType = 'adjust' | 'filter' | 'crop' | 'idphoto' | 'upscale' | null
export type BrushMode = 'foreground' | 'background' | 'erase'
export type PageKey = 'about' | 'privacy' | 'contact' | 'blog'

/** Cutout (AI background removal) progress state */
export interface CutoutState {
  active: boolean        // is processing in progress
  phase: 'idle' | 'download' | 'inference' | 'done' | 'error'
  progress: number       // 0–100
  message: string        // human-readable status
}

/** ID Photo generation state */
export interface IdPhotoState {
  active: boolean
  phase: 'idle' | 'cutout' | 'analyze' | 'crop' | 'background' | 'output' | 'done' | 'error'
  progress: number
  message: string
  resultUrl: string | null      // generated photo data URL
  resultWidth: number
  resultHeight: number
  printLayoutUrl: string | null // 6-inch print layout data URL
  selectedSpec: string          // spec id
  selectedBg: string            // bg color id
  wantPrint: boolean            // generate print layout
}

/** AI Upscale (Real-ESRGAN) state */
export interface UpscaleState {
  active: boolean
  phase: 'idle' | 'download' | 'inference' | 'done' | 'error'
  progress: number       // 0-100
  message: string
  resultUrl: string | null
  resultWidth: number
  resultHeight: number
  selectedModel: string  // model id
  selectedScale: number  // 2 or 4
}
export type CropRatio = 'free' | '1:1' | '4:3' | '3:4' | '16:9' | '9:16' | '3:2'

export interface AdjustValues {
  brightness: number   // -1 to 1
  contrast: number     // -1 to 1
  saturation: number   // -1 to 1
}

interface EditorState {
  tool: Tool
  hasImage: boolean
  canUndo: boolean
  canRedo: boolean
  theme: Theme
  exportOpen: boolean
  activePanel: PanelType
  adjustValues: AdjustValues
  cropRatio: CropRatio
  cropActive: boolean
  cutout: CutoutState
  brushActive: boolean
  brushMode: BrushMode
  brushSize: number
  idPhoto: IdPhotoState
  upscale: UpscaleState
  shortcutsOpen: boolean
  activePage: PageKey | null

  setTool: (tool: Tool) => void
  setHasImage: (v: boolean) => void
  setHistory: (canUndo: boolean, canRedo: boolean) => void
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  setExportOpen: (open: boolean) => void
  setActivePanel: (panel: PanelType) => void
  setAdjustValues: (values: Partial<AdjustValues>) => void
  resetAdjustValues: () => void
  setCropRatio: (ratio: CropRatio) => void
  setCropActive: (active: boolean) => void
  setCutout: (partial: Partial<CutoutState>) => void
  setBrushActive: (active: boolean) => void
  setBrushMode: (mode: BrushMode) => void
  setBrushSize: (size: number) => void
  setIdPhoto: (partial: Partial<IdPhotoState>) => void
  setUpscale: (partial: Partial<UpscaleState>) => void
  setShortcutsOpen: (open: boolean) => void
  setActivePage: (page: PageKey | null) => void
}

const defaultAdjust: AdjustValues = { brightness: 0, contrast: 0, saturation: 0 }

export const useEditorStore = create<EditorState>((set) => ({
  tool: 'select',
  hasImage: false,
  canUndo: false,
  canRedo: false,
  theme: 'light',
  exportOpen: false,
  activePanel: null,
  adjustValues: { ...defaultAdjust },
  cropRatio: 'free',
  cropActive: false,
  cutout: { active: false, phase: 'idle', progress: 0, message: '' },
  brushActive: false,
  brushMode: 'foreground',
  brushSize: 40,
  shortcutsOpen: false,
  activePage: null,
  idPhoto: {
    active: false,
    phase: 'idle',
    progress: 0,
    message: '',
    resultUrl: null,
    resultWidth: 0,
    resultHeight: 0,
    printLayoutUrl: null,
    selectedSpec: '1inch',
    selectedBg: 'blue',
    wantPrint: false,
  },
  upscale: {
    active: false,
    phase: 'idle',
    progress: 0,
    message: '',
    resultUrl: null,
    resultWidth: 0,
    resultHeight: 0,
    selectedModel: 'realesrgan-x4',
    selectedScale: 4,
  },

  setTool: (tool) => set({ tool }),
  setHasImage: (hasImage) => set((s) => ({ hasImage, activePanel: hasImage ? s.activePanel : null })),
  setHistory: (canUndo, canRedo) => set({ canUndo, canRedo }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (theme) => set({ theme }),
  setExportOpen: (exportOpen) => set({ exportOpen }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setAdjustValues: (values) => set((s) => ({ adjustValues: { ...s.adjustValues, ...values } })),
  resetAdjustValues: () => set({ adjustValues: { ...defaultAdjust } }),
  setCropRatio: (cropRatio) => set({ cropRatio }),
  setCropActive: (cropActive) => set({ cropActive }),
  setCutout: (partial) => set((s) => ({ cutout: { ...s.cutout, ...partial } })),
  setBrushActive: (brushActive) => set({ brushActive }),
  setBrushMode: (brushMode) => set({ brushMode }),
  setBrushSize: (brushSize) => set({ brushSize }),
  setIdPhoto: (partial) => set((s) => ({ idPhoto: { ...s.idPhoto, ...partial } })),
  setUpscale: (partial) => set((s) => ({ upscale: { ...s.upscale, ...partial } })),
  setShortcutsOpen: (shortcutsOpen) => set({ shortcutsOpen }),
  setActivePage: (activePage) => set({ activePage }),
}))
