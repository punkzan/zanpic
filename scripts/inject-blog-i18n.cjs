/**
 * Inject blog seed post translations into all locale files.
 * Run: node scripts/inject-blog-i18n.cjs
 */
const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'i18n', 'locales')

// Blog translations for all 6 seed posts in 8 languages
const BLOG_TRANSLATIONS = {
  zh: {
    seed1: {
      title: '如何拍出适合证件照的照片',
      category: '证件照技巧',
      excerpt: '证件照是很多人头疼的问题。本文从光线、角度、表情、着装四个方面，教你用手机拍出高质量的证件照原图，配合 Zan Pic 一键生成标准证件照。',
    },
    seed2: {
      title: 'AI 抠图技术原理：IS-Net 模型详解',
      category: '技术解析',
      excerpt: 'Zan Pic 的 AI 抠图功能基于 IS-Net（Iterative Spatial Refinement Network）模型。本文深入浅出地讲解模型架构、ONNX 推理流程和 WebGPU 加速原理。',
    },
    seed3: {
      title: '电商商品图背景移除最佳实践',
      category: '实用教程',
      excerpt: '商品图背景移除是电商运营的高频需求。本文介绍如何用涂抹抠图功能处理复杂边缘（如毛绒玩具、透明材质），以及如何批量处理商品图。',
    },
    seed4: {
      title: '证件照背景色选择指南',
      category: '证件照技巧',
      excerpt: '红色、白色、蓝色背景分别用于什么场景？各国签证照片对背景有什么要求？本文汇总了常见证件照规格和背景色标准。',
    },
    seed5: {
      title: '图片滤镜调色入门',
      category: '后期调色',
      excerpt: '亮度、对比度、饱和度是图片调色的三要素。本文从基础概念讲起，配合 Zan Pic 的实时预览功能，帮你快速掌握调色技巧。',
    },
    seed6: {
      title: 'WebGPU 加速：让浏览器 AI 推理快 10 倍',
      category: '技术解析',
      excerpt: 'WebGPU 是新一代浏览器图形 API，不仅用于渲染，还能加速 AI 推理。本文介绍 Zan Pic 如何利用 WebGPU 将抠图速度提升数倍。',
    },
  },
  en: {
    seed1: {
      title: 'How to Take Photos Perfect for ID Documents',
      category: 'ID Photo Tips',
      excerpt: 'ID photos are a common headache. This article covers lighting, angles, facial expressions, and attire—teaching you to capture high-quality ID photo originals with your phone, then generate standard ID photos with Zan Pic in one click.',
    },
    seed2: {
      title: 'AI Background Removal: How the IS-Net Model Works',
      category: 'Tech Deep Dive',
      excerpt: 'Zan Pic\'s AI cutout is powered by IS-Net (Iterative Spatial Refinement Network). This article explains the model architecture, ONNX inference pipeline, and WebGPU acceleration in an approachable way.',
    },
    seed3: {
      title: 'Best Practices for E-Commerce Product Background Removal',
      category: 'Practical Tutorial',
      excerpt: 'Removing backgrounds from product images is a frequent task in e-commerce. Learn how to handle complex edges (plush toys, transparent materials) with the brush tool and batch-process product photos efficiently.',
    },
    seed4: {
      title: 'ID Photo Background Color Guide',
      category: 'ID Photo Tips',
      excerpt: 'When should you use red, white, or blue backgrounds? What do different countries require for visa photos? This article summarizes common ID photo specifications and background color standards.',
    },
    seed5: {
      title: 'Getting Started with Photo Filters and Color Grading',
      category: 'Color Grading',
      excerpt: 'Brightness, contrast, and saturation are the three pillars of color grading. This article covers the fundamentals and pairs them with Zan Pic\'s real-time preview to help you master color adjustment quickly.',
    },
    seed6: {
      title: 'WebGPU Acceleration: 10x Faster AI Inference in Browsers',
      category: 'Tech Deep Dive',
      excerpt: 'WebGPU is the next-generation browser graphics API—not just for rendering, but also for accelerating AI inference. Learn how Zan Pic leverages WebGPU to boost background removal speed several times over.',
    },
  },
  ja: {
    seed1: {
      title: '証明写真に適した写真の撮り方',
      category: '証明写真のコツ',
      excerpt: '証明写真は多くの人が悩むポイントです。本記事では照明、角度、表情、服装の4つの面から、スマホで高品質な証明写真の原画を撮る方法を解説し、Zan Picでワンクリックで標準証明写真を生成します。',
    },
    seed2: {
      title: 'AI切り抜き技術の原理：IS-Netモデル詳解',
      category: '技術解説',
      excerpt: 'Zan PicのAI切り抜き機能はIS-Net（Iterative Spatial Refinement Network）モデルに基づいています。本記事ではモデルアーキテクチャ、ONNX推論プロセス、WebGPU加速の原理を分かりやすく解説します。',
    },
    seed3: {
      title: 'EC商品画像の背景除去ベストプラクティス',
      category: '実用チュートリアル',
      excerpt: '商品画像の背景除去はEC運営の高頻度ニーズです。ブラシツールで複雑なエッジ（ぬいぐるみ、透明素材など）を処理する方法や、商品画像の一括処理方法を紹介します。',
    },
    seed4: {
      title: '証明写真の背景色選びガイド',
      category: '証明写真のコツ',
      excerpt: '赤、白、青の背景はそれぞれどんな場面で使う？各国のビザ写真の背景要件は？本記事では一般的な証明写真の规格と背景色の基準をまとめました。',
    },
    seed5: {
      title: '写真フィルター・色調補正入門',
      category: '色調補正',
      excerpt: '明るさ、コントラスト、彩度は色調補正の三要素です。基礎概念から解説し、Zan Picのリアルタイムプレビュー機能と組み合わせて、色調補正のコツを素早く習得できます。',
    },
    seed6: {
      title: 'WebGPU加速：ブラウザのAI推論を10倍高速化',
      category: '技術解説',
      excerpt: 'WebGPUは次世代のブラウザグラフィックスAPIで、レンダリングだけでなくAI推論の加速にも使えます。Zan PicがWebGPUを活用して切り抜き速度を数倍に向上させる方法を紹介します。',
    },
  },
  ko: {
    seed1: {
      title: '증명사진에 적합한 사진 촬영 방법',
      category: '증명사진 팁',
      excerpt: '증명사진은 많은 사람들이 골칫거리입니다. 이 글에서는 조명, 각도, 표정, 복장 네 가지 측면에서 스마트폰으로 고품질 증명사진 원본을 촬영하는 방법을 알려드리고, Zan Pic으로 한 번의 클릭으로 표준 증명사진을 생성합니다.',
    },
    seed2: {
      title: 'AI 배경 제거 기술 원리: IS-Net 모델 상세 해설',
      category: '기술 분석',
      excerpt: 'Zan Pic의 AI 배경 제거 기능은 IS-Net(Iterative Spatial Refinement Network) 모델을 기반으로 합니다. 이 글에서는 모델 아키텍처, ONNX 추론 파이프라인, WebGPU 가속 원리를 알기 쉽게 설명합니다.',
    },
    seed3: {
      title: '이커머스 상품 이미지 배경 제거 모범 사례',
      category: '실용 튜토리얼',
      excerpt: '상품 이미지 배경 제거는 이커머스 운영의 빈번한 작업입니다. 브러시 도구로 복잡한 가장자리(봉제 인형, 투명 소재 등)를 처리하는 방법과 상품 이미지를 일괄 처리하는 방법을 소개합니다.',
    },
    seed4: {
      title: '증명사진 배경색 선택 가이드',
      category: '증명사진 팁',
      excerpt: '빨간색, 흰색, 파란색 배경은 각각 어떤 상황에서 사용할까요? 각국 비자 사진의 배경 요구 사항은 무엇일까요? 이 글에서는 일반적인 증명사진 규격과 배경색 기준을 요약했습니다.',
    },
    seed5: {
      title: '사진 필터 및 색보정 입문',
      category: '색보정',
      excerpt: '밝기, 대비, 채도는 색보정의 3요소입니다. 기초 개념부터 설명하고 Zan Pic의 실시간 미리보기 기능과 함께 사용하여 색보정 기술을 빠르게 익힐 수 있습니다.',
    },
    seed6: {
      title: 'WebGPU 가속: 브라우저 AI 추론 10배 향상',
      category: '기술 분석',
      excerpt: 'WebGPU는 차세대 브라우저 그래픽 API로, 렌더링뿐만 아니라 AI 추론 가속에도 사용할 수 있습니다. Zan Pic이 WebGPU를 활용하여 배경 제거 속도를 몇 배로 향상시키는 방법을 소개합니다.',
    },
  },
  fr: {
    seed1: {
      title: 'Comment prendre des photos parfaites pour documents d\'identité',
      category: 'Conseils photo d\'identité',
      excerpt: 'Les photos d\'identité sont un casse-tête pour beaucoup. Cet article couvre l\'éclairage, les angles, l\'expression et la tenue—apprenez à capturer des originaux de haute qualité avec votre téléphone, puis génère des photos d\'identité standard avec Zan Pic en un clic.',
    },
    seed2: {
      title: 'Suppression de fond IA : comment fonctionne le modèle IS-Net',
      category: 'Analyse technique',
      excerpt: 'La fonction de découpage IA de Zan Pic est propulsée par IS-Net (Iterative Spatial Refinement Network). Cet article explique l\'architecture du modèle, le pipeline d\'inférence ONNX et l\'accélération WebGPU de manière accessible.',
    },
    seed3: {
      title: 'Meilleures pratiques pour la suppression de fond de produits e-commerce',
      category: 'Tutoriel pratique',
      excerpt: 'Supprimer les arrière-plans d\'images de produits est une tâche fréquente en e-commerce. Apprenez à gérer les bords complexes (peluches, matériaux transparents) avec l\'outil pinceau et à traiter des lots d\'images efficacement.',
    },
    seed4: {
      title: 'Guide des couleurs de fond pour photos d\'identité',
      category: 'Conseils photo d\'identité',
      excerpt: 'Quand utiliser un fond rouge, blanc ou bleu ? Quelles sont les exigences des visas selon les pays ? Cet article résume les spécifications courantes et les normes de couleur de fond.',
    },
    seed5: {
      title: 'Initiation aux filtres et étalonnage colorimétrique',
      category: 'Étalonnage',
      excerpt: 'Luminosité, contraste et saturation sont les trois piliers de l\'étalonnage. Cet article couvre les fondamentaux et s\'appuie sur l\'aperçu en temps réel de Zan Pic pour maîtriser rapidement l\'ajustement des couleurs.',
    },
    seed6: {
      title: 'Accélération WebGPU : une inférence IA 10x plus rapide dans le navigateur',
      category: 'Analyse technique',
      excerpt: 'WebGPU est l\'API graphique de nouvelle génération—non seulement pour le rendu, mais aussi pour accélérer l\'inférence IA. Découvrez comment Zan Pic exploite WebGPU pour multiplier la vitesse de découpage.',
    },
  },
  de: {
    seed1: {
      title: 'So machen Sie perfekte Fotos für Ausweisdokumente',
      category: 'Ausweisfoto-Tipps',
      excerpt: 'Ausweisfotos sind für viele ein Ärgernis. Dieser Artikel behandelt Beleuchtung, Winkel, Mimik und Kleidung—lernen Sie, hochwertige Originalfotos mit dem Handy aufzunehmen und mit Zan Pic mit einem Klick Standardausweisfotos zu erstellen.',
    },
    seed2: {
      title: 'AI-Hintergrundentfernung: Wie das IS-Net-Modell funktioniert',
      category: 'Technische Analyse',
      excerpt: 'Die AI-Freistellung von Zan Pic basiert auf IS-Net (Iterative Spatial Refinement Network). Dieser Artikel erklärt die Modellarchitektur, die ONNX-Inferenz-Pipeline und die WebGPU-Beschleunigung verständlich.',
    },
    seed3: {
      title: 'Best Practices für Hintergrundentfernung bei E-Commerce-Produktbildern',
      category: 'Praktisches Tutorial',
      excerpt: 'Das Entfernen von Hintergründen aus Produktbildern ist eine häufige Aufgabe im E-Commerce. Lernen Sie, komplexe Kanten (Plüschtiere, transparente Materialien) mit dem Pinselwerkzeug zu bearbeiten und Produktbilder effizient im Stapel zu verarbeiten.',
    },
    seed4: {
      title: 'Leitfaden zur Wahl der Hintergrundfarbe für Ausweisfotos',
      category: 'Ausweisfoto-Tipps',
      excerpt: 'Wann verwendet man rote, weiße oder blaue Hintergründe? Was fordern verschiedene Länder für Visafotos? Dieser Artikel fasst gängige Ausweisfotospezifikationen und Hintergrundfarbstandards zusammen.',
    },
    seed5: {
      title: 'Einstieg in Filter und Color Grading',
      category: 'Color Grading',
      excerpt: 'Helligkeit, Kontrast und Sättigung sind die drei Säulen des Color Grading. Dieser Artikel behandelt die Grundlagen und nutzt die Echtzeitvorschau von Zan Pic, um die Farbanpassung schnell zu meistern.',
    },
    seed6: {
      title: 'WebGPU-Beschleunigung: 10x schnellere AI-Inferenz im Browser',
      category: 'Technische Analyse',
      excerpt: 'WebGPU ist die Grafik-API der nächsten Generation—nicht nur für Rendering, sondern auch zur Beschleunigung von AI-Inferenz. Erfahren Sie, wie Zan Pic WebGPU nutzt, um die Freistellungsgeschwindigkeit zu vervielfachen.',
    },
  },
  ru: {
    seed1: {
      title: 'Как сделать фото, идеально подходящее для документов',
      category: 'Советы по фото на документы',
      excerpt: 'Фото на документы — частая проблема. В этой статье рассматриваются освещение, ракурс, выражение лица и одежда — научитесь снимать качественные оригиналы на телефон и создавать стандартные фото с помощью Zan Pic в один клик.',
    },
    seed2: {
      title: 'AI-удаление фона: как работает модель IS-Net',
      category: 'Технический анализ',
      excerpt: 'Функция AI-вырезания Zan Pic основана на IS-Net (Iterative Spatial Refinement Network). В этой статье доступно объясняются архитектура модели, конвейер вывода ONNX и ускорение WebGPU.',
    },
    seed3: {
      title: 'Лучшие практики удаления фона с изображений товаров для e-commerce',
      category: 'Практическое руководство',
      excerpt: 'Удаление фона с изображений товаров — частая задача в e-commerce. Узнайте, как обрабатывать сложные края (плюшевые игрушки, прозрачные материалы) кистью и эффективно пакетно обрабатывать фотографии товаров.',
    },
    seed4: {
      title: 'Руководство по выбору цвета фона для фото на документы',
      category: 'Советы по фото на документы',
      excerpt: 'Когда использовать красный, белый или синий фон? Какие требования к фото на визу в разных странах? В этой статье собраны стандарты спецификаций и цвета фона для фото на документы.',
    },
    seed5: {
      title: 'Введение в фильтры и цветокоррекцию',
      category: 'Цветокоррекция',
      excerpt: 'Яркость, контраст и насыщенность — три столпа цветокоррекции. В этой статье изложены основы, а realtime-предпросмотр Zan Pic поможет быстро освоить настройку цвета.',
    },
    seed6: {
      title: 'Ускорение WebGPU: AI-вывод в браузере в 10 раз быстрее',
      category: 'Технический анализ',
      excerpt: 'WebGPU — это графический API нового поколения, используемый не только для рендеринга, но и для ускорения AI-вывода. Узнайте, как Zan Pic использует WebGPU для многократного ускорения вырезания фона.',
    },
  },
  ar: {
    seed1: {
      title: 'كيفية التقاط صور مثالية لوثائق الهوية',
      category: 'نصائح صور الهوية',
      excerpt: 'صور الهوية تمثل صداعاً للكثيرين. تتناول هذه المقالة الإضاءة والزوايا وتعبيرات الوجه والملابس — تعلم كيفية التقاط صور أصلية عالية الجودة بهاتفك، ثم أنشئ صور هوية قياسية بنقرة واحدة باستخدام Zan Pic.',
    },
    seed2: {
      title: 'إزالة الخلفية بالذكاء الاصطناعي: كيف يعمل نموذج IS-Net',
      category: 'تحليل تقني',
      excerpt: 'تعتمد ميزة القص بالذكاء الاصطناعي في Zan Pic على نموذج IS-Net (Iterative Spatial Refinement Network). تشرح هذه المقالة بنية النموذج وخطوات استنتاج ONNX وتسريع WebGPU بطريقة مبسطة.',
    },
    seed3: {
      title: 'أفضل ممارسات إزالة خلفية صور المنتجات للتجارة الإلكترونية',
      category: 'دليل عملي',
      excerpt: 'إزالة الخلفية من صور المنتجات مهمة متكررة في التجارة الإلكترونية. تعلم كيفية معالجة الحواف المعقدة (الدمى المحشوة، المواد الشفافة) بأداة الفرشاة ومعالجة صور المنتجات دفعة واحدة بكفاءة.',
    },
    seed4: {
      title: 'دليل اختيار لون خلفية صور الهوية',
      category: 'نصائح صور الهوية',
      excerpt: 'متى تستخدم خلفية حمراء أو بيضاء أو زرقاء؟ ما هي متطلبات صور التأشيرات في مختلف البلدان؟ تلخص هذه المقالة مواصفات صور الهوية الشائعة ومعايير ألوان الخلفية.',
    },
    seed5: {
      title: 'مقدمة في المرشحات وتدرج الألوان',
      category: 'تدرج الألوان',
      excerpt: 'السطوع والتباين والتشبع هي الأركان الثلاثة لتدرج الألوان. تغطي هذه المقالة الأساسيات وتستخدم معاينة Zan Pic في الوقت الفعلي لمساعدتك على إتقان ضبط الألوان بسرعة.',
    },
    seed6: {
      title: 'تسريع WebGPU: استنتاج ذكاء اصطناعي أسرع 10 مرات في المتصفح',
      category: 'تحليل تقني',
      excerpt: 'WebGPU هو واجهة برمجة الرسومات للجيل القادم — ليس للعرض فحسب، بل أيضاً لتسريع استنتاج الذكاء الاصطناعي. تعرف على كيفية استفادة Zan Pic من WebGPU لمضاعفة سرعة إزالة الخلفية عدة مرات.',
    },
  },
}

// Process each locale file
const langs = Object.keys(BLOG_TRANSLATIONS)

for (const lang of langs) {
  const filePath = path.join(LOCALES_DIR, `${lang}.json`)
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  // Add or replace blog section
  json.blog = BLOG_TRANSLATIONS[lang]

  // Write back with 2-space indentation (matching existing format)
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`✓ ${lang}.json — blog section added (${Object.keys(BLOG_TRANSLATIONS[lang]).length} posts)`)
}

console.log('\nDone! All 8 locale files updated.')
