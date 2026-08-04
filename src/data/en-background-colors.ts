/**
 * English programmatic SEO data: Background color tool pages.
 * Each entry generates an English standalone SEO page at /en/background/:slug.
 */

export interface BackgroundColorSpec {
  slug: string
  colorName: string
  hexValue: string
  rgbValue: string
  title: string
  useCases: string[]
  intro: string
  faq: { q: string; a: string }[]
}

export const EN_BACKGROUND_COLORS: BackgroundColorSpec[] = [
  {
    slug: 'white',
    colorName: 'White',
    hexValue: '#FFFFFF',
    rgbValue: 'rgb(255, 255, 255)',
    title: 'White Background ID Photo Maker — Generate Online',
    useCases: [
      'China passport, Hong Kong & Macau permit',
      'US passport and visa',
      'UK passport (light grey near white)',
      'Canada passport',
      'Japan visa',
      'Schengen visa (some countries)',
      'Academic certificates, professional credentials',
    ],
    intro: 'White background is the internationally accepted standard ID photo background color, used by most countries for passports, visas, and official documents. Zan Pic uses AI background removal to automatically replace the original background with pure white (#FFFFFF), no manual brushing needed. Suitable for Chinese passports, US passports, Schengen visas, Japan visas, and other white-background ID photo requirements.',
    faq: [
      { q: 'Which documents require white background ID photos?', a: 'White background is the most universal color, used for Chinese passports, US passports/visas, Canadian passports, Japan visas, Schengen visas (some countries), academic certificates, and more. Most internationally accepted ID photos require white.' },
      { q: 'What is the color value for white background?', a: 'The standard white background color value is #FFFFFF, or RGB(255,255,255). Zan Pic outputs pure white without grey tint.' },
      { q: 'How do I change a photo background to white?', a: 'Upload your photo to Zan Pic, use the AI background removal feature to automatically remove the background, then select the white background in the ID photo tool. The entire process is automatic and takes 2-5 seconds.' },
    ],
  },
  {
    slug: 'blue',
    colorName: 'Blue',
    hexValue: '#438EDB',
    rgbValue: 'rgb(67, 142, 219)',
    title: 'Blue Background ID Photo Maker — Generate Online',
    useCases: [
      'Chinese graduation and degree certificates',
      'Chinese social security card (some cities)',
      'Chinese health certificate',
      'Chinese work ID',
      'Resumes (some industries prefer blue)',
      'Student ID, campus card',
    ],
    intro: 'Blue background (#438EDB) is commonly used for education and social security systems in China. Graduation certificates, degree certificates, social security cards, and health certificates mostly use blue background. Zan Pic AI background removal automatically separates the person from the background and replaces it with standard blue. Suitable for graduation certificates, degree certificates, social security cards, health certificates, and other blue-background ID photo needs.',
    faq: [
      { q: 'Which documents require blue background ID photos?', a: 'Blue background is mainly used for graduation certificates, degree certificates, social security cards, health certificates, and student IDs. The Chinese education system uniformly uses blue as the standard background color for academic credential photos.' },
      { q: 'What is the standard color value for blue background?', a: 'The standard Chinese blue background color value is approximately #438EDB, or RGB(67,142,219). It is a medium-saturation sky blue, not dark blue or light blue.' },
      { q: 'Why do graduation certificate photos use blue background?', a: 'Blue is the unified requirement of the education department for academic credential photos, representing formality and standardization. Blue also provides good contrast with white clothing and looks visually harmonious.' },
    ],
  },
  {
    slug: 'red',
    colorName: 'Red',
    hexValue: '#D9001B',
    rgbValue: 'rgb(217, 0, 27)',
    title: 'Red Background ID Photo Maker — Generate Online',
    useCases: [
      'Chinese marriage certificate',
      'Chinese divorce certificate',
      'Professional qualification exam registration',
      'Insurance documents',
      'Some work IDs',
      'Some retirement certificates',
    ],
    intro: 'Red background (#D9001B) is mainly used for marriage certificates, professional qualification exam registrations, and some insurance documents. Red represents celebration and formality; marriage certificate photos must use red background two-inch couple photos. Zan Pic automatically removes the original background and replaces it with standard red, suitable for marriage certificates, professional exams, and other red-background ID photo needs.',
    faq: [
      { q: 'Which documents require red background ID photos?', a: 'Red background is mainly used for marriage certificates, divorce certificates, professional qualification exam registrations, and insurance documents. Marriage certificate photos require red background two-inch couple photos.' },
      { q: 'What is the standard color value for red background?', a: 'The standard Chinese red background color value is approximately #D9001B, or RGB(217,0,27). It is a bright red, not dark red or maroon.' },
      { q: 'Can marriage certificate photos use red background?', a: 'Marriage certificate photos must use red background, with a standard two-inch (35×49mm) couple photo. Zan Pic can process each person separately and then composite them onto a red background.' },
    ],
  },
  {
    slug: 'gradient',
    colorName: 'Gradient',
    hexValue: 'linear-gradient(135deg, #667eea, #764ba2)',
    rgbValue: 'gradient',
    title: 'Gradient Background Avatar Maker — Generate Online',
    useCases: [
      'Social media avatars (Instagram/WeChat/Discord)',
      'Professional avatars (LinkedIn/DingTalk)',
      'Personal brand avatars',
      'Creative ID photos',
      'Blog author avatars',
      'Gaming/community avatars',
    ],
    intro: 'Gradient backgrounds are a popular trend for social media and personal brand avatars. After Zan Pic AI background removal removes the cluttered original background, it can be replaced with selected gradient colors. From purple dreamy to blue tech feel, multiple gradient styles are available with one click. Suitable for Instagram, WeChat, LinkedIn, Discord, and other social platforms, making your personal image more professional and recognizable.',
    faq: [
      { q: 'Which platforms are gradient background avatars suitable for?', a: 'Gradient background avatars are suitable for Instagram, WeChat, LinkedIn, Discord, Twitter, and all social platforms. Compared with solid colors, gradients have more design sense and recognizability.' },
      { q: 'How do I make a gradient background avatar?', a: 'Upload your photo to Zan Pic, use AI background removal to remove the background, then select a gradient style in the background replacement tool. The entire process is automatic and requires no design skills.' },
      { q: 'Which is better, gradient or solid background?', a: 'Solid colors are more formal (suitable for ID photos), while gradients are more stylish (suitable for social media avatars). Choose according to the usage scenario.' },
    ],
  },
]

/** Get an English spec by slug */
export function getEnBackgroundColorSpec(slug: string): BackgroundColorSpec | undefined {
  return EN_BACKGROUND_COLORS.find((s) => s.slug === slug)
}

/** Get all English slugs */
export function getEnBackgroundSlugs(): string[] {
  return EN_BACKGROUND_COLORS.map((s) => s.slug)
}
