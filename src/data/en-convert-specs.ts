/**
 * English programmatic SEO data: Image format conversion specs.
 * Each entry generates an English standalone page at /en/convert/:slug.
 */

export interface ConvertSpec {
  slug: string
  sourceFormat: string
  targetFormat: string
  sourceMime: string
  targetMime: string
  sourceExt: string
  targetExt: string
  title: string
  intro: string
  sourcePros: string[]
  sourceCons: string[]
  targetPros: string[]
  targetCons: string[]
  commonUses: string[]
  tips: string[]
  faq: { q: string; a: string }[]
}

export const EN_CONVERT_SPECS: ConvertSpec[] = [
  {
    slug: 'jpg-to-png',
    sourceFormat: 'JPG',
    targetFormat: 'PNG',
    sourceMime: 'image/jpeg',
    targetMime: 'image/png',
    sourceExt: '.jpg',
    targetExt: '.png',
    title: 'JPG to PNG — Free Online Converter',
    intro:
      'JPG to PNG is one of the most common image format conversions. JPG (JPEG) uses lossy compression and is ideal for photos, but does not support transparent backgrounds. PNG uses lossless compression and supports an alpha transparency channel, making it perfect for icons, logos, UI elements, and any image that needs a transparent background. With Zan Pic\'s online converter, you can convert JPG images to PNG format for free. All processing happens locally in your browser — images are never uploaded to any server, fully protecting your privacy. The conversion takes just a few seconds and supports batch operation.',
    sourcePros: ['Small file size', 'Ideal for photo storage', 'Supported by all devices', 'Controllable quality loss with lossy compression'],
    sourceCons: ['No transparent background', 'Quality degrades after repeated editing', 'Not suitable for text and line art'],
    targetPros: ['Supports transparent background', 'Lossless compression', 'Ideal for icons and UI elements', 'Sharp text edges without blur'],
    targetCons: ['File size usually larger', 'Photo file size may be 3-5x larger than JPG'],
    commonUses: ['Logo design', 'Icon creation', 'Composite images needing transparency', 'UI design drafts', 'Screenshot storage'],
    tips: [
      'PNG files after conversion are usually 2-5x larger than JPG. If size matters, consider WebP format.',
      'JPG is lossy, so converting to PNG cannot recover already lost quality, but it prevents further loss from subsequent editing.',
      'If you need a transparent background, you still need to manually remove the background after JPG to PNG conversion.',
    ],
    faq: [
      { q: 'Does JPG to PNG conversion lose quality?', a: 'No. PNG uses lossless compression, so the conversion process does not introduce additional quality loss. However, the original JPG was already lossy, so converting to PNG cannot recover details lost during JPG compression.' },
      { q: 'Why is the file larger after JPG to PNG conversion?', a: 'This is normal. PNG lossless files are usually 2-5x larger than JPG. If file size is a concern, use WebP format, which supports both lossless and transparent backgrounds with smaller file sizes.' },
      { q: 'Does JPG to PNG give me a transparent background?', a: 'Not directly. JPG does not support an alpha channel, so after conversion the background remains opaque. You need to use a background removal tool to get a transparent effect.' },
    ],
  },
  {
    slug: 'png-to-jpg',
    sourceFormat: 'PNG',
    targetFormat: 'JPG',
    sourceMime: 'image/png',
    targetMime: 'image/jpeg',
    sourceExt: '.png',
    targetExt: '.jpg',
    title: 'PNG to JPG — Free Online Converter',
    intro:
      'PNG to JPG conversion can significantly reduce file size, making it ideal for web pages, emails, and social media. PNG files are usually 2-5x larger than equivalent-quality JPGs because PNG uses lossless compression. After converting PNG to JPG, file size can be reduced by 60%-80% while the quality loss is almost imperceptible. Zan Pic\'s converter runs locally in the browser, supports custom JPG compression quality (0-100%), and allows direct download after conversion. For PNGs with transparent backgrounds, you can choose white or a custom fill color when converting to JPG.',
    sourcePros: ['Supports transparent background', 'Lossless compression', 'Clear text and lines', 'Ideal for icons and UI'],
    sourceCons: ['Large file size', 'Too large for photo storage', 'Not ideal for web acceleration'],
    targetPros: ['Small file size', 'Ideal for photo storage', 'Fast web loading', 'Widest compatibility'],
    targetCons: ['No transparent background', 'Lossy compression', 'Text edges may show artifacts'],
    commonUses: ['Web image optimization', 'Email attachment compression', 'Social media upload', 'Photo storage', 'Reducing file size'],
    tips: [
      'When PNG has a transparent background, choose a fill color (default white) before converting to JPG.',
      'Set compression quality to 85-90% for the best balance of size and quality.',
      'For text screenshots, JPG may produce blur artifacts. Keep PNG or use high quality settings.',
    ],
    faq: [
      { q: 'What happens to the transparent background when converting PNG to JPG?', a: 'JPG does not support transparency, so transparent areas will be filled with white (or your chosen background color). To keep transparency, use PNG or WebP format.' },
      { q: 'What quality setting is best for PNG to JPG?', a: 'We recommend 85-90% as the best balance between file size and quality. For photos, 80% is almost indistinguishable; for high-fidelity images, use 95%.' },
      { q: 'How much smaller will the file be after conversion?', a: 'PNG to JPG at 85% quality usually reduces file size by 60%-80%. The exact amount depends on image content; colorful photos compress better.' },
    ],
  },
  {
    slug: 'jpg-to-webp',
    sourceFormat: 'JPG',
    targetFormat: 'WebP',
    sourceMime: 'image/jpeg',
    targetMime: 'image/webp',
    sourceExt: '.jpg',
    targetExt: '.webp',
    title: 'JPG to WebP — Free Online Converter',
    intro:
      'WebP is a modern image format developed by Google. Compared to JPG, it can reduce file size by 25%-35% while maintaining the same visual quality. Converting JPG to WebP can significantly improve webpage loading speed and Core Web Vitals metrics, which is beneficial for SEO rankings. WebP supports both lossy and lossless compression, as well as transparent backgrounds (which JPG does not). All major browsers (Chrome, Firefox, Safari, Edge) now support WebP. Zan Pic\'s converter runs locally in the browser and supports custom compression quality. Download the converted .webp file directly.',
    sourcePros: ['Widest compatibility', 'Supported by almost all devices', 'Mature compression algorithm'],
    sourceCons: ['File size 25-35% larger than WebP', 'No transparent background', 'No animation support'],
    targetPros: ['25-35% smaller than JPG', 'Supports transparent background', 'Supports animation', 'Supported by all major browsers', 'Google recommended format'],
    targetCons: ['Some old software does not support', 'iOS 14 and below do not support', 'Limited editing software support'],
    commonUses: ['Web image optimization', 'E-commerce product images', 'Blog images', 'CDN acceleration', 'Core Web Vitals optimization'],
    tips: [
      'At 80-85% WebP quality, file size is about 30% smaller than equivalent-quality JPG.',
      'Using WebP can improve PageSpeed Insights score by 5-15 points.',
      'We recommend keeping the original JPG as a fallback and using the <picture> tag for adaptive format delivery.',
    ],
    faq: [
      { q: 'Is WebP supported by all browsers?', a: 'Chrome, Firefox, Safari (14+), and Edge all support WebP, covering over 97% of users. Only IE and a few very old browsers do not support it. For unsupported environments, use the <picture> tag to provide a JPG fallback.' },
      { q: 'How much smaller is JPG to WebP?', a: 'At equivalent visual quality, WebP is 25%-35% smaller than JPG. For large photos, this can save hundreds of KB and significantly improve page load speed.' },
      { q: 'Is WebP good for SEO?', a: 'Yes. Google officially recommends WebP. Smaller file sizes can improve LCP (Largest Contentful Paint) metrics, improve Core Web Vitals scores, and indirectly boost search rankings.' },
    ],
  },
  {
    slug: 'webp-to-jpg',
    sourceFormat: 'WebP',
    targetFormat: 'JPG',
    sourceMime: 'image/webp',
    targetMime: 'image/jpeg',
    sourceExt: '.webp',
    targetExt: '.jpg',
    title: 'WebP to JPG — Free Online Converter',
    intro:
      'Although WebP is becoming more popular, some software, platforms, and older systems still do not support it. When you need to use images in environments that do not support WebP, converting WebP to JPG is the simplest solution. Zan Pic\'s converter can directly convert WebP to JPG in the browser without installing any software. It supports custom JPG compression quality, and all processing is done locally without uploading images to a server. After conversion, you get a highly compatible JPG file that works on any device and platform.',
    sourcePros: ['Small file size', 'Supports transparency and animation', 'Google recommended format'],
    sourceCons: ['Some software does not support', 'Some social platforms do not support upload', 'Incompatible with old systems'],
    targetPros: ['Widest compatibility', 'Supported by all devices and platforms', 'Good compression'],
    targetCons: ['Larger file than WebP', 'No transparent background', 'No animation support'],
    commonUses: ['Compatibility conversion', 'Use on older systems', 'Social platform upload', 'Office document illustrations', 'Print output'],
    tips: [
      'When WebP has a transparent background, converting to JPG will automatically fill with white background.',
      'Set JPG quality to 90% to best preserve WebP image quality.',
      'Some WebP files are animated; converting to JPG will only keep the first frame.',
    ],
    faq: [
      { q: 'Why convert WebP to JPG?', a: 'Some software (such as older Photoshop versions, certain office software) and platforms (some social media, e-commerce backends) do not support WebP upload. Converting to JPG ensures maximum compatibility.' },
      { q: 'Does WebP to JPG lose quality?', a: 'There will be slight loss. Both WebP and JPG are lossy compression formats, so conversion introduces an additional compression step. Set JPG quality above 90% and the quality loss is almost imperceptible.' },
      { q: 'What happens to animated WebP when converting to JPG?', a: 'JPG does not support animation, so only the first frame of the animated WebP will be kept. To keep animation, convert to GIF format.' },
    ],
  },
  {
    slug: 'png-to-webp',
    sourceFormat: 'PNG',
    targetFormat: 'WebP',
    sourceMime: 'image/png',
    targetMime: 'image/webp',
    sourceExt: '.png',
    targetExt: '.webp',
    title: 'PNG to WebP — Free Online Converter',
    intro:
      'PNG to WebP is one of the best ways to reduce file size. WebP lossless files are 20%-30% smaller than PNG while fully preserving transparent background support. This means you can significantly reduce the file size of icons, logos, and UI elements without sacrificing quality or transparency. For websites with many image assets, PNG to WebP can notably improve page load speed. Zan Pic\'s converter supports both lossless and lossy modes, and all processing is done locally in the browser, protecting your privacy.',
    sourcePros: ['Lossless compression', 'Supports transparent background', 'Sharp text edges', 'Wide compatibility'],
    sourceCons: ['Large file size', 'Not ideal for photos', 'Slow web loading'],
    targetPros: ['20-30% smaller than PNG (lossless)', 'Supports transparent background', 'Supports animation', 'Google recommended format', 'Fast web loading'],
    targetCons: ['Some old software does not support', 'iOS 14 and below do not support', 'Limited editing tool support'],
    commonUses: ['Web icon optimization', 'Logo compression', 'UI asset optimization', 'Transparent background images', 'Core Web Vitals optimization'],
    tips: [
      'Lossless WebP is about 26% smaller than PNG, making it the best web format for transparent images.',
      'For icons that do not need transparency, lossy WebP (quality 80%) can reduce size by another 30-50%.',
      'Replacing PNG with WebP can significantly improve LCP metrics.',
    ],
    faq: [
      { q: 'Will transparent background be preserved when converting PNG to WebP?', a: 'Yes. WebP supports the alpha transparency channel, just like PNG, so transparency is fully preserved after conversion.' },
      { q: 'Is PNG to WebP lossy or lossless?', a: 'Both are supported. In lossless mode, WebP is about 26% smaller than PNG with identical quality. Lossy mode can further reduce size but sacrifices some quality. Zan Pic supports switching between the two modes.' },
      { q: 'Which browsers support transparent WebP images?', a: 'Chrome, Firefox, Safari 14+, and Edge all support WebP with transparency. Coverage exceeds 97%; only IE and a few very old browsers do not support it.' },
    ],
  },
  {
    slug: 'webp-to-png',
    sourceFormat: 'WebP',
    targetFormat: 'PNG',
    sourceMime: 'image/webp',
    targetMime: 'image/png',
    sourceExt: '.webp',
    targetExt: '.png',
    title: 'WebP to PNG — Free Online Converter',
    intro:
      'When you need to use transparent images in design software or systems that do not support WebP, converting WebP to PNG is the best choice. PNG is a universal format that supports transparent backgrounds and is supported by almost all software and platforms. Zan Pic\'s converter can losslessly convert WebP to PNG, fully preserving the transparency channel and all pixel information. Conversion is done locally in the browser, and no files are uploaded. This is especially useful when WebP images downloaded from the web need to be imported into Photoshop, Sketch, and other design tools.',
    sourcePros: ['Small file size', 'Supports transparency and animation', 'Supported by modern browsers'],
    sourceCons: ['Some design software does not support', 'Poor office software compatibility', 'Some platforms do not support upload'],
    targetPros: ['Lossless compression', 'Supports transparent background', 'Supported by all software', 'Good design tool compatibility'],
    targetCons: ['Large file size', 'Not ideal for photo storage', 'Slower web loading'],
    commonUses: ['Import into design software', 'Office document illustrations', 'Compatibility conversion', 'Print output', 'Preserve transparent background'],
    tips: [
      'WebP to PNG is a lossless conversion; image quality remains completely unchanged.',
      'File size will increase after conversion, which is normal because PNG compression is less efficient than WebP.',
      'Animated WebP to PNG will only keep the first frame.',
    ],
    faq: [
      { q: 'Does WebP to PNG lose quality?', a: 'No. PNG uses lossless compression, so no quality is lost during conversion. All pixels and transparency channel information from the WebP are fully preserved.' },
      { q: 'Why is the file larger after WebP to PNG conversion?', a: 'Because PNG compression is less efficient than WebP. WebP lossless mode is about 26% smaller than PNG, so conversion increases file size by about 35%, which is normal.' },
      { q: 'When do I need to convert WebP to PNG?', a: 'When you need to edit images in software that does not support WebP (such as older Photoshop versions) or import images into office documents, PNG is the more compatible choice.' },
    ],
  },
  {
    slug: 'bmp-to-png',
    sourceFormat: 'BMP',
    targetFormat: 'PNG',
    sourceMime: 'image/bmp',
    targetMime: 'image/png',
    sourceExt: '.bmp',
    targetExt: '.png',
    title: 'BMP to PNG — Free Online Converter',
    intro:
      'BMP (Bitmap) is Windows\' native bitmap format, using uncompressed storage, so file sizes are usually very large. Converting BMP to PNG can reduce file size by 50%-90% without any quality loss. PNG is also lossless but uses efficient DEFLATE compression. Zan Pic\'s converter can quickly convert BMP files to PNG, with all processing done locally in the browser. This is the simplest and most effective way to reduce BMP file size.',
    sourcePros: ['Lossless storage', 'Simple format', 'Native Windows support'],
    sourceCons: ['Huge file size', 'No transparent background', 'No compression', 'Not suitable for web use'],
    targetPros: ['Lossless compression', 'File 50-90% smaller than BMP', 'Supports transparent background', 'Supported by all platforms'],
    targetCons: ['Larger than JPG and WebP', 'Not ideal for photo storage'],
    commonUses: ['BMP file compression', 'Legacy system image migration', 'Lossless quality storage', 'Web image optimization'],
    tips: [
      'BMP to PNG is lossless; image quality remains completely unchanged.',
      'BMP files are usually 5-20x larger than PNG, so file size drops dramatically after conversion.',
      'If you need to further reduce size, you can convert PNG to WebP afterward.',
    ],
    faq: [
      { q: 'Does BMP to PNG lose quality?', a: 'Not at all. Both BMP and PNG are lossless formats, so no pixel information is lost during conversion. The converted image quality is identical to the original BMP.' },
      { q: 'How much smaller is BMP to PNG?', a: 'BMP uses no compression, while PNG uses DEFLATE compression. Converted files are usually 50%-90% smaller, depending on image content complexity.' },
      { q: 'Do I need to install software for BMP to PNG conversion?', a: 'No. Zan Pic\'s converter runs entirely in the browser, with no software or plugins to install. Just open the webpage and use it.' },
    ],
  },
  {
    slug: 'bmp-to-jpg',
    sourceFormat: 'BMP',
    targetFormat: 'JPG',
    sourceMime: 'image/bmp',
    targetMime: 'image/jpeg',
    sourceExt: '.bmp',
    targetExt: '.jpg',
    title: 'BMP to JPG — Free Online Converter',
    intro:
      'BMP to JPG is one of the most effective ways to reduce file size. BMP files use no compression; a 1920×1080 BMP image can exceed 6MB, while converting to JPG (90% quality) usually results in only 200-500KB, reducing size by over 90%. Zan Pic\'s converter supports custom JPG compression quality and completes all processing locally in the browser. It is especially suitable when you need to send BMP screenshots or scans by email, upload them to websites, or store them in cloud drives.',
    sourcePros: ['Lossless storage', 'Simple format', 'Native Windows support'],
    sourceCons: ['Huge file size', 'No compression', 'Not suitable for transfer and storage', 'Not suitable for web use'],
    targetPros: ['Extremely small file size (90%+ smaller than BMP)', 'Widest compatibility', 'Ideal for photo storage', 'Fast web loading'],
    targetCons: ['Lossy compression', 'No transparent background', 'Quality degrades after repeated editing'],
    commonUses: ['BMP file compression', 'Screenshot compression', 'Reducing email attachments', 'Web image upload', 'Saving cloud storage space'],
    tips: [
      'BMP to JPG can reduce size by over 90%, the most efficient compression method.',
      'Set quality to 85-90% for the best balance of size and quality.',
      'For BMP screenshots with text, set quality to 95% or above to avoid blurry text.',
    ],
    faq: [
      { q: 'Does BMP to JPG lose much quality?', a: 'At 85-90% quality, the difference is almost invisible to the naked eye. BMP to JPG is lossy compression, but for photos and screenshots, the advantage of reducing size by over 90% far outweighs the slight quality loss.' },
      { q: 'How much smaller can BMP to JPG files be?', a: 'BMP uses no compression. A 6MB BMP converted to JPG (90% quality) is usually only 200-500KB, a reduction of over 90%.' },
      { q: 'Does BMP to JPG support transparent background?', a: 'Neither BMP nor JPG supports transparent backgrounds, so the conversion does not involve an alpha channel. The background remains unchanged.' },
    ],
  },
  {
    slug: 'gif-to-png',
    sourceFormat: 'GIF',
    targetFormat: 'PNG',
    sourceMime: 'image/gif',
    targetMime: 'image/png',
    sourceExt: '.gif',
    targetExt: '.png',
    title: 'GIF to PNG — Free Online Converter',
    intro:
      'GIF to PNG conversion serves two main purposes: converting static GIFs to PNG for better compression and wider compatibility, or extracting a single frame from an animated GIF as a PNG image. PNG 8-bit palette mode (PNG-8) files are usually smaller than equivalent-quality GIFs. Zan Pic\'s converter will convert the first frame of a GIF into a PNG image. All processing is done locally in the browser, and no files are uploaded.',
    sourcePros: ['Supports animation', 'Wide compatibility', 'Small file size in palette mode'],
    sourceCons: ['Maximum 256 colors', 'No semi-transparency', 'Lower compression efficiency than PNG'],
    targetPros: ['Full color (16.7 million colors)', 'Supports semi-transparency', 'Higher compression efficiency', 'Lossless compression'],
    targetCons: ['No animation support', 'PNG-24 files larger than GIF', 'Not suitable for simple animations'],
    commonUses: ['Static GIF conversion', 'Extract GIF frame', 'Improve image colors', 'Get semi-transparent effects'],
    tips: [
      'GIF to PNG extracts the first frame. To extract other frames, use a dedicated GIF editing tool.',
      'GIF supports a maximum of 256 colors. Although PNG supports full color after conversion, already-lost colors cannot be recovered.',
      'If the GIF has a transparent background, the transparency will be preserved after conversion to PNG.',
    ],
    faq: [
      { q: 'Will animation remain after GIF to PNG conversion?', a: 'No. PNG does not support animation, so only the first frame of the animated GIF will be kept. To keep animation, keep the GIF format or convert to animated WebP/AVIF.' },
      { q: 'Will transparent background be preserved when converting GIF to PNG?', a: 'Yes. GIF\'s 1-bit transparency (fully transparent or fully opaque) will be fully converted to PNG. Moreover, PNG supports semi-transparency (alpha channel), which GIF does not.' },
      { q: 'Will GIF to PNG files be smaller?', a: 'For simple palette images, PNG-8 is usually 5-10% smaller than GIF. For complex images converted to PNG-24, files may be larger but colors are richer.' },
    ],
  },
  {
    slug: 'gif-to-jpg',
    sourceFormat: 'GIF',
    targetFormat: 'JPG',
    sourceMime: 'image/gif',
    targetMime: 'image/jpeg',
    sourceExt: '.gif',
    targetExt: '.jpg',
    title: 'GIF to JPG — Free Online Converter',
    intro:
      'GIF to JPG is suitable for converting static GIF images to the smaller JPG format. Although GIF uses LZW lossless compression, it only supports 256 colors, making it poor for photo-like images. JPG supports full color (16.7 million colors) and higher compression ratios, providing better image quality with smaller file sizes. Zan Pic\'s converter will convert the first frame of a GIF to a JPG image, and the transparent background will be automatically filled with white after conversion. All processing is done locally in the browser.',
    sourcePros: ['Supports animation', 'Wide compatibility', 'Lossless compression'],
    sourceCons: ['Maximum 256 colors', 'Larger file than JPG', 'Not ideal for photos', 'No semi-transparency'],
    targetPros: ['Full color support', 'Small file size', 'High compression efficiency', 'Ideal for photo storage'],
    targetCons: ['No animation support', 'No transparent background', 'Lossy compression'],
    commonUses: ['Static GIF compression', 'Improve color quality', 'Reduce file size', 'Web image optimization'],
    tips: [
      'GIF to JPG extracts the first frame; animation effects will be lost.',
      'GIF\'s transparent background will be automatically filled with white when converted to JPG.',
      'GIF only has 256 colors. Although JPG supports full color after conversion, already-lost colors cannot be recovered.',
    ],
    faq: [
      { q: 'Will animation remain after GIF to JPG conversion?', a: 'No. JPG does not support animation, so only the first frame of the GIF will be kept. To keep animation, keep the GIF format or convert to animated WebP.' },
      { q: 'How is transparent background handled in GIF to JPG?', a: 'JPG does not support transparent backgrounds, so transparent areas of the GIF will be automatically filled with white. To preserve transparency, convert to PNG or WebP format.' },
      { q: 'Will GIF to JPG files be smaller?', a: 'Usually yes. JPG compression is more efficient than GIF, especially for color-rich photo-like images. However, for simple icons with only a few colors, GIF may be smaller.' },
    ],
  },
]

export function getEnConvertSpec(slug: string): ConvertSpec | undefined {
  return EN_CONVERT_SPECS.find((s) => s.slug === slug)
}

export function getEnConvertSlugs(): string[] {
  return EN_CONVERT_SPECS.map((s) => s.slug)
}
