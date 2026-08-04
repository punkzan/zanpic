import type { SeoLang } from '../hooks/useSeoLang'

export const UI_STRINGS: Record<string, Record<SeoLang, string>> = {
  home: { zh: '首页', en: 'Home' },
  idPhotoMaker: { zh: '证件照制作', en: 'ID Photo Maker' },
  photoResizer: { zh: '图片尺寸调整', en: 'Photo Resizer' },
  backgroundRemover: { zh: 'AI 抠图', en: 'Background Remover' },
  photoFilter: { zh: '图片滤镜', en: 'Photo Filter' },
  convertTool: { zh: '格式转换', en: 'Format Converter' },
  blog: { zh: '经验分享', en: 'Blog' },

  specsTitle: { zh: '规格参数', en: 'Specifications' },
  pixelSize: { zh: '像素尺寸', en: 'Pixel Size' },
  physicalSize: { zh: '物理尺寸', en: 'Physical Size' },
  resolution: { zh: '分辨率', en: 'Resolution' },
  backgroundColor: { zh: '背景颜色', en: 'Background Color' },
  headHeight: { zh: '头部高度', en: 'Head Height' },
  aspectRatio: { zh: '宽高比', en: 'Aspect Ratio' },
  recommendedFormat: { zh: '推荐格式', en: 'Recommended Format' },
  maxFileSize: { zh: '文件大小限制', en: 'Max File Size' },

  dressCode: { zh: '着装要求', en: 'Dress Code' },
  compositionRules: { zh: '拍摄要求', en: 'Composition Requirements' },
  commonUses: { zh: '常见用途', en: 'Common Uses' },
  tips: { zh: '制作技巧', en: 'Tips' },
  sourcePros: { zh: '源格式优点', en: 'Source Format Pros' },
  sourceCons: { zh: '源格式缺点', en: 'Source Format Cons' },
  targetPros: { zh: '目标格式优点', en: 'Target Format Pros' },
  targetCons: { zh: '目标格式缺点', en: 'Target Format Cons' },

  howToMake: { zh: '如何用 Zan Pic 制作', en: 'How to Make with Zan Pic' },
  howToCrop: { zh: '如何用 Zan Pic 裁剪', en: 'How to Crop with Zan Pic' },
  howToConvert: { zh: '如何用 Zan Pic 转换格式', en: 'How to Convert with Zan Pic' },
  stepUpload: { zh: '上传照片', en: 'Upload Photo' },
  stepCrop: { zh: '选择比例裁剪', en: 'Choose Ratio & Crop' },
  stepBgRemove: { zh: 'AI 抠图', en: 'AI Background Removal' },
  stepIdPhoto: { zh: '证件照生成', en: 'Generate ID Photo' },
  stepExport: { zh: '选择底色导出', en: 'Choose Background & Export' },
  stepOptionalBg: { zh: '可选 AI 抠图', en: 'Optional Background Removal' },
  stepAdjust: { zh: '调整参数', en: 'Adjust Settings' },
  stepConvert: { zh: '开始转换', en: 'Start Conversion' },
  stepDownload: { zh: '下载结果', en: 'Download Result' },

  faq: { zh: '常见问题', en: 'FAQ' },
  relatedSpecs: { zh: '相关证件照规格', en: 'Related ID Photo Specifications' },
  relatedSizes: { zh: '其他社媒尺寸规格', en: 'Related Social Media Sizes' },
  relatedConversions: { zh: '相关格式转换', en: 'Related Conversions' },
  useCases: { zh: '适用场景', en: 'Use Cases' },

  ctaMakeIdPhoto: { zh: '立即制作', en: 'Make Now' },
  ctaCropImage: { zh: '立即裁剪图片', en: 'Crop Image Now' },
  ctaChangeBg: { zh: '立即换背景', en: 'Change Background Now' },
  ctaConvert: { zh: '开始转换', en: 'Start Conversion' },
  ctaStart: { zh: '开始使用', en: 'Get Started' },

  // Convert page
  reupload: { zh: '重新上传', en: 'Re-upload' },
  original: { zh: '原图', en: 'Original' },
  converted: { zh: '转换后', en: 'Converted' },
  converting: { zh: '转换中…', en: 'Converting…' },
  uploadHint: { zh: '拖拽文件到此处，或点击上传', en: 'Drag file here, or click to upload' },
  localProcessing: { zh: '浏览器本地处理，图片不上传服务器', en: 'Browser-based local processing. Images are never uploaded.' },
  compressionQuality: { zh: '压缩质量', en: 'Compression Quality' },
  backgroundFillColor: { zh: '背景填充色', en: 'Background Fill Color' },
  clickToStart: { zh: '点击下方按钮开始转换', en: 'Click the button below to start conversion' },
  download: { zh: '下载', en: 'Download' },
  formatComparison: { zh: '格式对比', en: 'Format Comparison' },
  pros: { zh: '优点', en: 'Pros' },
  cons: { zh: '缺点', en: 'Cons' },
  conversionTips: { zh: '转换技巧', en: 'Conversion Tips' },
  otherConversions: { zh: '其他格式转换', en: 'Other Conversions' },

  // Error messages
  errUploadFormat: { zh: '请上传', en: 'Please upload' },
  errFormatFile: { zh: '格式的图片', en: 'format image' },
  errImageLoad: { zh: '图片加载失败', en: 'Image failed to load' },
  errConvertFailed: { zh: '转换失败，请尝试其他图片', en: 'Conversion failed. Please try another image.' },
  errProcessFailed: { zh: '图片处理失败，请确保文件未损坏', en: 'Image processing failed. Please ensure the file is not corrupted.' },
}

export function t(key: string, lang: SeoLang): string {
  return UI_STRINGS[key]?.[lang] ?? key
}
