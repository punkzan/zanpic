/**
 * Programmatic SEO data: Background color tool pages.
 * Each entry generates a standalone SEO page at /background/:slug.
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

export const BACKGROUND_COLORS: BackgroundColorSpec[] = [
  {
    slug: 'white',
    colorName: '白色',
    hexValue: '#FFFFFF',
    rgbValue: 'rgb(255, 255, 255)',
    title: '白底证件照制作 — 在线生成白色背景证件照',
    useCases: [
      '中国护照、港澳通行证',
      '美国护照、签证',
      '英国护照（浅灰色近似白）',
      '加拿大护照',
      '日本签证',
      '申根签证（部分国家）',
      '学历证件、职业资格证书',
    ],
    intro: '白色背景是国际通用的证件照标准底色，被绝大多数国家的护照、签证和官方证件采用。Zan Pic 使用 AI 抠图技术自动移除原图背景，替换为纯净白色 (#FFFFFF)，无需手工涂抹。适用于中国护照、美国护照、申根签证、日本签证等各类白底证件照需求。',
    faq: [
      { q: '白底证件照适用于哪些场景？', a: '白色背景是最通用的底色，适用于中国护照、美国护照/签证、加拿大护照、日本签证、申根签证（部分国家）、学历证件等。大部分国际通用证件照均要求白底。' },
      { q: '白色背景的色值是多少？', a: '标准白色背景色值为 #FFFFFF，即 RGB(255,255,255)。Zan Pic 输出的白底照片为纯白，无灰度偏色。' },
      { q: '如何把照片背景换成白色？', a: '上传照片到 Zan Pic，使用 AI 智能抠图功能自动移除背景，然后在证件照功能中选择白色背景即可。全程自动完成，2-5 秒出图。' },
    ],
  },
  {
    slug: 'blue',
    colorName: '蓝色',
    hexValue: '#438EDB',
    rgbValue: 'rgb(67, 142, 219)',
    title: '蓝底证件照制作 — 在线生成蓝色背景证件照',
    useCases: [
      '中国毕业证、学位证',
      '中国社保卡（部分城市）',
      '中国健康证',
      '中国工作证',
      '简历（部分行业偏好蓝底）',
      '学生证、校园一卡通',
    ],
    intro: '蓝色背景 (#438EDB) 是中国教育和社保系统常用的证件照底色。毕业证、学位证、社保卡、健康证等大多使用蓝底。Zan Pic 的 AI 抠图技术可自动分离人像与背景，替换为标准蓝色。适用于毕业证、学位证、社保卡、健康证等蓝底证件照需求。',
    faq: [
      { q: '蓝底证件照适用于哪些场景？', a: '蓝色背景主要用于毕业证、学位证、社保卡、健康证、学生证等。中国教育系统统一使用蓝底作为学历证件照标准底色。' },
      { q: '蓝色背景的标准色值是多少？', a: '中国蓝底证件照标准色值约为 #438EDB，即 RGB(67,142,219)。这是一个中等饱和度的天蓝色，不是深蓝或浅蓝。' },
      { q: '毕业证照片为什么用蓝底？', a: '蓝色是教育部门对学历证件照的统一要求，代表正式和规范。蓝底也与白色衣服形成良好对比，视觉上更加协调。' },
    ],
  },
  {
    slug: 'red',
    colorName: '红色',
    hexValue: '#D9001B',
    rgbValue: 'rgb(217, 0, 27)',
    title: '红底证件照制作 — 在线生成红色背景证件照',
    useCases: [
      '中国结婚证',
      '中国离婚证',
      '职称考试报名',
      '保险证件',
      '部分工作证',
      '部分退休证',
    ],
    intro: '红色背景 (#D9001B) 主要用于结婚证、职称考试报名和部分保险证件。红色代表喜庆和正式，结婚证照片必须使用红底二寸合照。Zan Pic 可自动移除原图背景并替换为标准红色，适用于结婚证、职称考试等红底证件照需求。',
    faq: [
      { q: '红底证件照适用于哪些场景？', a: '红色背景主要用于结婚证、离婚证、职称考试报名、保险证件等。结婚证照片要求红底二寸合照。' },
      { q: '红色背景的标准色值是多少？', a: '中国红底证件照标准色值约为 #D9001B，即 RGB(217,0,27)。这是一个鲜红色，不是深红或暗红。' },
      { q: '结婚证照片可以用红底吗？', a: '结婚证照片必须使用红色背景，标准为二寸（35×49mm）合照。Zan Pic 可为双方分别抠图换红底后合成。' },
    ],
  },
  {
    slug: 'gradient',
    colorName: '渐变',
    hexValue: 'linear-gradient(135deg, #667eea, #764ba2)',
    rgbValue: 'gradient',
    title: '渐变背景头像制作 — 在线生成创意渐变背景头像',
    useCases: [
      '社交媒体头像（Instagram/微信/Discord）',
      '职场头像（LinkedIn/钉钉）',
      '个人品牌头像',
      '创意证件照',
      '博客作者头像',
      '游戏/社区头像',
    ],
    intro: '渐变背景是社交媒体和个人品牌头像的流行趋势。Zan Pic 的 AI 抠图功能移除原图杂乱背景后，可替换为精选渐变色彩。从紫色梦幻到蓝色科技感，多种渐变风格一键切换。适用于 Instagram、微信、LinkedIn、Discord 等社交平台头像，让你的个人形象更加专业和有辨识度。',
    faq: [
      { q: '渐变背景头像适合哪些平台？', a: '渐变背景头像适合 Instagram、微信、LinkedIn、Discord、Twitter 等所有社交平台。相比纯色背景，渐变更有设计感和辨识度。' },
      { q: '如何制作渐变背景头像？', a: '上传照片到 Zan Pic，使用 AI 智能抠图移除背景，然后在背景替换中选择渐变风格即可。全程自动完成，无需设计技能。' },
      { q: '渐变背景和纯色背景哪个更好？', a: '纯色背景更正式（适合证件照），渐变背景更有设计感（适合社交媒体头像）。根据使用场景选择即可。' },
    ],
  },
]

/** Get a spec by slug */
export function getBackgroundColorSpec(slug: string): BackgroundColorSpec | undefined {
  return BACKGROUND_COLORS.find((s) => s.slug === slug)
}

/** Get all slugs */
export function getBackgroundSlugs(): string[] {
  return BACKGROUND_COLORS.map((s) => s.slug)
}
