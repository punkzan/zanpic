/**
 * Add new blogEditor i18n keys to all locale files.
 * Run: node scripts/inject-blog-editor-i18n.cjs
 */
const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'i18n', 'locales')

const NEW_KEYS = {
  zh: { defaultTab: '默认内容', translationFor: '{{lang}} 翻译', uncategorized: '未分类' },
  en: { defaultTab: 'Default', translationFor: '{{lang}} Translation', uncategorized: 'Uncategorized' },
  ja: { defaultTab: 'デフォルト', translationFor: '{{lang}}翻訳', uncategorized: '未分類' },
  ko: { defaultTab: '기본', translationFor: '{{lang}} 번역', uncategorized: '미분류' },
  fr: { defaultTab: 'Par défaut', translationFor: 'Traduction {{lang}}', uncategorized: 'Non classé' },
  de: { defaultTab: 'Standard', translationFor: '{{lang}}-Übersetzung', uncategorized: 'Unkategorisiert' },
  ru: { defaultTab: 'По умолчанию', translationFor: 'Перевод: {{lang}}', uncategorized: 'Без категории' },
  ar: { defaultTab: 'افتراضي', translationFor: 'ترجمة {{lang}}', uncategorized: 'غير مصنف' },
}

for (const [lang, keys] of Object.entries(NEW_KEYS)) {
  const filePath = path.join(LOCALES_DIR, `${lang}.json`)
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  json.admin.blogEditor = { ...json.admin.blogEditor, ...keys }
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`✓ ${lang}.json — added ${Object.keys(keys).length} blogEditor keys`)
}

console.log('\nDone!')
