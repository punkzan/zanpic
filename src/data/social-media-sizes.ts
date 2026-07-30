/**
 * Programmatic SEO data: Social media image size specifications.
 * Each entry generates a standalone SEO page at /resize/:slug.
 */

export interface SocialMediaSize {
  slug: string
  platform: string
  type: string
  title: string
  pixelWidth: number
  pixelHeight: number
  aspectRatio: string
  recommendedFormat: string
  maxFileSize: string
  intro: string
  tips: string[]
  faq: { q: string; a: string }[]
}

export const SOCIAL_MEDIA_SIZES: SocialMediaSize[] = [
  {
    slug: 'instagram-profile',
    platform: 'Instagram',
    type: 'Profile Photo',
    title: 'Instagram Profile Photo Size (320×320px)',
    pixelWidth: 320,
    pixelHeight: 320,
    aspectRatio: '1:1',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 10MB',
    intro: 'Instagram profile photo displays at 320×320 pixels on desktop, but is shown much smaller in the app. Upload a square image at least 320×320px for best quality. Instagram will crop your image to a circle, so keep important content centered. Zan Pic can crop your photo to a perfect 1:1 square with AI background removal for a clean, professional look.',
    tips: [
      'Upload at least 320×320px — Instagram compresses larger images',
      'Keep logo/face centered — corners are cropped to circle',
      'Use high contrast — profile photos appear tiny in comments',
      'JPG for photos, PNG for logos with text',
    ],
    faq: [
      { q: 'What size is Instagram profile photo?', a: 'Instagram profile photo is displayed at 320×320 pixels. Upload a square image at 320px or larger for best quality. The displayed version is circular.' },
      { q: 'Can I use a non-square photo for Instagram profile?', a: 'Instagram requires a 1:1 square crop. Zan Pic can crop any photo to a perfect square with AI-powered composition.' },
    ],
  },
  {
    slug: 'instagram-story',
    platform: 'Instagram',
    type: 'Story',
    title: 'Instagram Story Size (1080×1920px)',
    pixelWidth: 1080,
    pixelHeight: 1920,
    aspectRatio: '9:16',
    recommendedFormat: 'JPG or MP4',
    maxFileSize: '< 30MB (image)',
    intro: 'Instagram Stories use a 9:16 vertical aspect ratio at 1080×1920 pixels. The top and bottom areas may be obscured by UI elements (profile name, reply bar), so keep important content in the center 80%. Zan Pic can resize and crop your photos to the exact Story dimensions.',
    tips: [
      '1080×1920px is the sweet spot for quality and file size',
      'Keep key content in the center — Instagram overlays UI top/bottom',
      'Use 9:16 ratio for full-screen vertical content',
      'PNG for text overlays, JPG for photos',
    ],
    faq: [
      { q: 'Instagram Story dimensions in pixels?', a: 'Instagram Stories are 1080×1920 pixels (9:16 aspect ratio). This is the standard vertical format for mobile-first content.' },
    ],
  },
  {
    slug: 'instagram-post-square',
    platform: 'Instagram',
    type: 'Square Post',
    title: 'Instagram Square Post Size (1080×1080px)',
    pixelWidth: 1080,
    pixelHeight: 1080,
    aspectRatio: '1:1',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 30MB',
    intro: 'Instagram square posts are 1080×1080 pixels (1:1 ratio). This is the classic Instagram format. Square posts display at maximum size in the feed. Zan Pic can crop and resize any photo to a perfect 1080×1080 square.',
    tips: [
      '1080×1080px gives best quality in feed',
      'Square posts get maximum display area on mobile',
      'Keep important elements away from edges',
      'Test on mobile before posting — most users are on phones',
    ],
    faq: [
      { q: 'Best Instagram post size?', a: '1080×1080px (square) is the most versatile. For vertical content use 1080×1350px (4:5). Zan Pic supports all Instagram post sizes.' },
    ],
  },
  {
    slug: 'youtube-thumbnail',
    platform: 'YouTube',
    type: 'Video Thumbnail',
    title: 'YouTube Thumbnail Size (1280×720px)',
    pixelWidth: 1280,
    pixelHeight: 720,
    aspectRatio: '16:9',
    recommendedFormat: 'JPG, PNG, or GIF',
    maxFileSize: '< 2MB',
    intro: 'YouTube video thumbnails are 1280×720 pixels (16:9 aspect ratio). Thumbnails are the single most important factor for click-through rate. Use high-contrast images, large text, and emotional faces. Zan Pic can crop your screenshot or photo to the exact 1280×720 thumbnail size with filters and text overlays.',
    tips: [
      '1280×720px is mandatory — smaller images may be rejected',
      'Use the 16:9 widescreen ratio for all YouTube thumbnails',
      'Add bold text and high-contrast colors for CTR',
      'Faces with emotion get 38% more clicks',
    ],
    faq: [
      { q: 'What is YouTube thumbnail size in pixels?', a: 'YouTube thumbnails must be 1280×720 pixels (16:9 ratio), under 2MB, in JPG, PNG, or GIF format.' },
      { q: 'Can I use any aspect ratio for YouTube thumbnail?', a: 'No, YouTube requires exactly 16:9 (1280×720px). Non-compliant images will be cropped or rejected.' },
    ],
  },
  {
    slug: 'youtube-banner',
    platform: 'YouTube',
    type: 'Channel Banner',
    title: 'YouTube Channel Banner Size (2560×1440px)',
    pixelWidth: 2560,
    pixelHeight: 1440,
    aspectRatio: '16:9',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 6MB',
    intro: 'YouTube channel banners are 2560×1440 pixels (16:9). However, only the center 1546×423px is visible on all devices. Design with the "safe zone" in mind. Zan Pic can resize and crop your banner image to the full 2560×1440 specification.',
    tips: [
      'Total size: 2560×1440px, safe zone: 1546×423px (center)',
      'Mobile crops to 1546×423, desktop shows full width',
      'Keep logos/text in the center safe zone',
      'Use high-resolution images for retina displays',
    ],
    faq: [
      { q: 'YouTube banner safe zone dimensions?', a: 'The safe zone is 1546×423 pixels in the center. Content outside this area may be cropped on mobile devices.' },
    ],
  },
  {
    slug: 'facebook-cover',
    platform: 'Facebook',
    type: 'Cover Photo',
    title: 'Facebook Cover Photo Size (820×312px)',
    pixelWidth: 820,
    pixelHeight: 312,
    aspectRatio: '2.6:1',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 100KB (recommended)',
    intro: 'Facebook cover photos display at 820×312 pixels on desktop and 640×360px on mobile. The optimal size is 820×462px to avoid cropping on mobile. Zan Pic can resize your image to the exact Facebook cover dimensions.',
    tips: [
      'Desktop: 820×312px, Mobile: 640×360px',
      'Use 820×462px to cover both — center content in safe zone',
      'Text in cover images should be minimal and bold',
      'Facebook compresses images — start with high quality',
    ],
    faq: [
      { q: 'Facebook cover photo size 2026?', a: 'Facebook cover photo is 820×312 pixels on desktop and 640×360 pixels on mobile. Upload at 820×462px for best results across devices.' },
    ],
  },
  {
    slug: 'twitter-header',
    platform: 'Twitter/X',
    type: 'Header Photo',
    title: 'Twitter/X Header Photo Size (1500×500px)',
    pixelWidth: 1500,
    pixelHeight: 500,
    aspectRatio: '3:1',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 5MB',
    intro: 'Twitter/X header photos are 1500×500 pixels (3:1 ratio). The visible area varies by device — keep important content in the center. Profile photo overlays the header at the bottom-left. Zan Pic can crop and resize your image to the exact 1500×500 Twitter header size.',
    tips: [
      '1500×500px is the recommended upload size',
      'Keep content in the center 1250×400px safe zone',
      'Profile photo sits at bottom-left — avoid placing content there',
      'JPG works best for photographic headers',
    ],
    faq: [
      { q: 'Twitter header photo size?', a: 'Twitter/X header is 1500×500 pixels (3:1 ratio). Keep important content centered to avoid cropping on different devices.' },
    ],
  },
  {
    slug: 'linkedin-cover',
    platform: 'LinkedIn',
    type: 'Cover Photo',
    title: 'LinkedIn Cover Photo Size (1584×396px)',
    pixelWidth: 1584,
    pixelHeight: 396,
    aspectRatio: '4:1',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 8MB',
    intro: 'LinkedIn cover photos are 1584×396 pixels (4:1 ratio). This is a personal banner on your profile page. For company pages, the size is 1128×191px. Zan Pic can resize your image to the exact LinkedIn cover specification.',
    tips: [
      'Personal profile: 1584×396px (4:1 ratio)',
      'Company page: 1128×191px (different size!)',
      'Keep text minimal — LinkedIn crops differently by device',
      'Use professional imagery — this is your career banner',
    ],
    faq: [
      { q: 'LinkedIn cover photo vs company page banner?', a: 'Personal profile cover is 1584×396px. Company page banner is 1128×191px. They are different sizes — do not use the same image.' },
    ],
  },
  {
    slug: 'linkedin-profile-photo',
    platform: 'LinkedIn',
    type: 'Profile Photo',
    title: 'LinkedIn Profile Photo Size (400×400px)',
    pixelWidth: 400,
    pixelHeight: 400,
    aspectRatio: '1:1',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 8MB',
    intro: 'LinkedIn profile photos are 400×400 pixels (1:1 square). LinkedIn crops to a circle. Use a professional headshot with a clean background. Zan Pic can remove any background with AI and replace it with a professional white or grey backdrop — perfect for LinkedIn.',
    tips: [
      '400×400px minimum, 1:1 square',
      'LinkedIn crops to circle — center your face',
      'Use AI background removal for a clean, professional look',
      'Dress professionally — this is your career image',
    ],
    faq: [
      { q: 'Best LinkedIn profile photo background?', a: 'White or light grey background is ideal. Use Zan Pic\'s AI background remover to clean up any photo for a professional LinkedIn headshot.' },
      { q: 'LinkedIn profile photo size?', a: '400×400 pixels, square (1:1). Upload at 400px or larger for best quality. LinkedIn displays it as a circle.' },
    ],
  },
  {
    slug: 'facebook-profile',
    platform: 'Facebook',
    type: 'Profile Photo',
    title: 'Facebook Profile Photo Size (170×170px)',
    pixelWidth: 170,
    pixelHeight: 170,
    aspectRatio: '1:1',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 15MB',
    intro: 'Facebook profile photos display at 170×170 pixels on desktop, 128×128 on mobile. Upload a square image at 512×512 or larger for best quality. Facebook crops to a circle. Zan Pic can crop and optimize your photo for Facebook profile.',
    tips: [
      'Upload at 512×512px — Facebook compresses to 170×170',
      'Cropped to circle — center important content',
      'JPG for photos, PNG for logos',
      'Faces perform better than logos on personal profiles',
    ],
    faq: [
      { q: 'Facebook profile photo dimensions?', a: 'Displays at 170×170px on desktop. Upload at 512×512px or larger for best quality. Square (1:1) format required.' },
    ],
  },
  {
    slug: 'tiktok-profile',
    platform: 'TikTok',
    type: 'Profile Photo',
    title: 'TikTok Profile Photo Size (200×200px)',
    pixelWidth: 200,
    pixelHeight: 200,
    aspectRatio: '1:1',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 5MB',
    intro: 'TikTok profile photos are 200×200 pixels (1:1 square). The displayed size is very small in the app, so use high-contrast images. Zan Pic can crop your photo to the exact square size and remove backgrounds with AI for a clean profile picture.',
    tips: [
      '200×200px, 1:1 square',
      'TikTok crops to circle — center content',
      'High contrast is essential — profile photos appear tiny',
      'Use AI background removal for a pop-out effect',
    ],
    faq: [
      { q: 'TikTok profile photo size?', a: '200×200 pixels, square format. TikTok displays it as a circle. Upload a high-contrast image for best visibility.' },
    ],
  },
  {
    slug: 'wechat-avatar',
    platform: '微信',
    type: 'Profile Avatar',
    title: '微信公众号头像尺寸（200×200px）',
    pixelWidth: 200,
    pixelHeight: 200,
    aspectRatio: '1:1',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 2MB',
    intro: '微信公众号头像要求 200×200 像素，正方形，文件大小不超过 2MB。个人微信号头像也建议使用正方形。微信会裁剪为圆形显示。Zan Pic 可裁剪至精确的正方形尺寸并优化文件大小。',
    tips: [
      '200×200px 正方形，不超过 2MB',
      '微信裁剪为圆形 — 重要内容居中',
      '公众号建议使用高对比度 logo',
      'JPG 格式文件更小，PNG 适合带文字的 logo',
    ],
    faq: [
      { q: '微信公众号头像尺寸要求？', a: '公众号头像要求 200×200 像素正方形，文件不超过 2MB。建议上传高清 logo 或品牌图片。' },
    ],
  },
  {
    slug: 'discord-avatar',
    platform: 'Discord',
    type: 'Avatar',
    title: 'Discord Avatar Size (128×128px)',
    pixelWidth: 128,
    pixelHeight: 128,
    aspectRatio: '1:1',
    recommendedFormat: 'JPG, PNG, or GIF',
    maxFileSize: '< 8MB',
    intro: 'Discord avatars display at 128×128 pixels but support up to 512×512px upload. Discord Nitro users can use animated GIFs. Zan Pic can crop your image to a perfect square and add filters for a unique Discord avatar.',
    tips: [
      '128×128px display, upload up to 512×512px',
      '1:1 square, cropped to circle',
      'GIF supported for Nitro users',
      'High contrast stands out in chat lists',
    ],
    faq: [
      { q: 'Discord avatar size?', a: 'Discord displays avatars at 128×128px. Upload up to 512×512px for best quality. Supports JPG, PNG, and GIF (with Nitro).' },
    ],
  },
  {
    slug: 'pinterest-pin',
    platform: 'Pinterest',
    type: 'Standard Pin',
    title: 'Pinterest Pin Image Size (1000×1500px)',
    pixelWidth: 1000,
    pixelHeight: 1500,
    aspectRatio: '2:3',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 20MB',
    intro: 'Pinterest standard pins are 1000×1500 pixels (2:3 ratio). Vertical images perform best on Pinterest. Use high-quality images with text overlays for maximum engagement. Zan Pic can resize and crop your photos to the optimal Pinterest pin dimensions.',
    tips: [
      '1000×1500px (2:3) is the optimal pin size',
      'Vertical images get more screen real estate',
      'Add text overlays — text pins get 58% more repins',
      'Use 2:3 ratio — taller than 1:1 but shorter than 9:16',
    ],
    faq: [
      { q: 'Best Pinterest pin size?', a: '1000×1500 pixels (2:3 ratio) is the optimal size. Vertical pins perform significantly better than square or horizontal.' },
    ],
  },
  {
    slug: 'whatsapp-profile',
    platform: 'WhatsApp',
    type: 'Profile Photo',
    title: 'WhatsApp Profile Photo Size (500×500px)',
    pixelWidth: 500,
    pixelHeight: 500,
    aspectRatio: '1:1',
    recommendedFormat: 'JPG or PNG',
    maxFileSize: '< 5MB',
    intro: 'WhatsApp profile photos display at 500×500 pixels but appear as small as 96×96 in chats. Upload a square image at 500px for best quality. WhatsApp crops to a circle. Zan Pic can crop your photo and remove backgrounds for a clean WhatsApp profile picture.',
    tips: [
      'Upload at 500×500px square',
      'Cropped to circle — center your face/logo',
      'High contrast for tiny chat display',
      'AI background removal creates a clean look',
    ],
    faq: [
      { q: 'WhatsApp profile photo size?', a: 'WhatsApp displays profile photos at up to 500×500px. Upload a square image (1:1) at 500px for best quality.' },
    ],
  },
]

/** Get a size by slug */
export function getSocialMediaSize(slug: string): SocialMediaSize | undefined {
  return SOCIAL_MEDIA_SIZES.find((s) => s.slug === slug)
}

/** Get all slugs */
export function getSocialMediaSlugs(): string[] {
  return SOCIAL_MEDIA_SIZES.map((s) => s.slug)
}
