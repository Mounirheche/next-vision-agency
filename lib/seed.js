"use strict";

const DEFAULT_SETTINGS = {
  email: "hello@nextvision.agency",
  phone: "+213 XXX XXX XXX",
  whatsapp: "",
  address: { en: "Algiers, Algeria", ar: "الجزائر العاصمة، الجزائر" },
  social: { facebook: "", instagram: "", linkedin: "", twitter: "" },
};

const DEFAULT_PORTFOLIO = [
  {
    id: "ecommerce",
    title: { en: "E-Commerce Platform", ar: "منصة تجارة إلكترونية" },
    category: { en: "Web Development", ar: "تطوير المواقع" },
    tag: "web",
    image: "assets/proj-1.webp",
    projectUrl: "",
    gallery: [],
    description: {
      en: "A full-featured online storefront built for a growing retail brand — product catalog, cart, secure checkout, and an admin dashboard for managing inventory and orders in real time.",
      ar: "منصة تجارة إلكترونية متكاملة لعلامة تجارية في طور النمو — كتالوج منتجات، سلة تسوق، دفع آمن، ولوحة تحكم لإدارة المخزون والطلبات في الوقت الفعلي.",
    },
  },
  {
    id: "fooddelivery",
    title: { en: "Food Delivery App", ar: "تطبيق توصيل الطعام" },
    category: { en: "Mobile Application", ar: "تطبيق جوال" },
    tag: "mobile",
    image: "assets/proj-2.webp",
    projectUrl: "",
    gallery: [],
    description: {
      en: "A native mobile app connecting local restaurants with hungry customers — live order tracking, in-app payments, and a driver dashboard that keeps deliveries on time.",
      ar: "تطبيق جوال أصلي يربط المطاعم المحلية بالعملاء — تتبع مباشر للطلبات، دفع داخل التطبيق، ولوحة تحكم للسائقين تضمن وصول الطلبات في وقتها.",
    },
  },
  {
    id: "techstartup",
    title: { en: "Tech Startup Identity", ar: "هوية شركة تقنية ناشئة" },
    category: { en: "Branding", ar: "الهوية التجارية" },
    tag: "branding",
    image: "assets/proj-3.webp",
    projectUrl: "",
    gallery: [],
    description: {
      en: "A complete brand identity for an early-stage SaaS startup — logo system, color palette, typography, and a pitch-deck template built to win investor confidence.",
      ar: "هوية بصرية متكاملة لشركة تقنية ناشئة في مراحلها الأولى — نظام شعار، لوحة ألوان، طباعة، ونموذج عرض تقديمي مصمم لكسب ثقة المستثمرين.",
    },
  },
  {
    id: "realestate",
    title: { en: "Real Estate Portal", ar: "بوابة عقارية" },
    category: { en: "Web Development", ar: "تطوير المواقع" },
    tag: "web",
    image: "assets/proj-4.webp",
    projectUrl: "",
    gallery: [],
    description: {
      en: "A property listings platform with advanced search filters, virtual tours, and agent profiles — designed to make browsing and booking viewings effortless.",
      ar: "منصة إعلانات عقارية بفلاتر بحث متقدمة، جولات افتراضية، وملفات للوكلاء العقاريين — مصممة لتسهيل تصفح العقارات وحجز الزيارات.",
    },
  },
  {
    id: "fittrack",
    title: { en: "FitTrack Wellness App", ar: "تطبيق FitTrack للياقة البدنية" },
    category: { en: "Mobile Application", ar: "تطبيق جوال" },
    tag: "mobile",
    image: null,
    projectUrl: "",
    gallery: [],
    description: {
      en: "A fitness and wellness companion app with personalized workout plans, progress tracking, and social challenges to keep users motivated.",
      ar: "تطبيق للياقة البدنية والعافية يقدم خطط تمارين مخصصة، تتبع التقدم، وتحديات اجتماعية تحافظ على تحفيز المستخدمين.",
    },
  },
  {
    id: "horizon",
    title: { en: "Horizon SaaS Dashboard", ar: "لوحة تحكم Horizon SaaS" },
    category: { en: "Web Development", ar: "تطوير المواقع" },
    tag: "web",
    image: null,
    projectUrl: "",
    gallery: [],
    description: {
      en: "A data-dense analytics dashboard for a B2B SaaS product — real-time charts, team permissions, and a design system built to scale across every screen.",
      ar: "لوحة تحكم تحليلية غنية بالبيانات لمنتج SaaS موجه للشركات — رسوم بيانية فورية، صلاحيات فرق العمل، ونظام تصميم مبني للتوسع عبر كل الشاشات.",
    },
  },
  {
    id: "aurora",
    title: { en: "Aurora Skincare Rebrand", ar: "إعادة تصميم هوية Aurora لمستحضرات البشرة" },
    category: { en: "Branding", ar: "الهوية التجارية" },
    tag: "branding",
    image: null,
    projectUrl: "",
    gallery: [],
    description: {
      en: "A ground-up rebrand for a skincare label — packaging design, a soft and premium visual language, and brand guidelines for a confident market relaunch.",
      ar: "إعادة تصميم شاملة لهوية علامة تجارية لمستحضرات العناية بالبشرة — تصميم تغليف، لغة بصرية فاخرة وناعمة، وإرشادات هوية لإطلاق واثق في السوق.",
    },
  },
  {
    id: "marche",
    title: { en: "Marché Boutique Identity", ar: "هوية متجر Marché" },
    category: { en: "Branding", ar: "الهوية التجارية" },
    tag: "branding",
    image: null,
    projectUrl: "",
    gallery: [],
    description: {
      en: "A warm, editorial brand identity for a boutique retailer — logo, packaging, and in-store signage that bring a curated shopping experience to life.",
      ar: "هوية تجارية دافئة وأنيقة لمتجر بوتيك — شعار، تغليف، ولافتات داخل المتجر تجسد تجربة تسوق مختارة بعناية.",
    },
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    id: "testi1",
    name: { en: "Ahmed K.", ar: "أحمد ك." },
    role: { en: "CEO, LoftReal Homes", ar: "الرئيس التنفيذي، LoftReal Homes" },
    quote: {
      en: "Next Vision transformed our online presence completely. The website they built is fast, beautiful, and converts visitors into clients.",
      ar: "غيّرت Next Vision حضورنا الرقمي بالكامل. الموقع الذي بنوه سريع وجميل ويحوّل الزوار إلى عملاء.",
    },
    rating: 5,
    photo: null,
  },
  {
    id: "testi2",
    name: { en: "Sara M.", ar: "سارة م." },
    role: { en: "Founder, DineBox", ar: "المؤسسة، DineBox" },
    quote: {
      en: "The mobile app they developed for us exceeded all expectations. Professional team, on-time delivery, and great communication.",
      ar: "تطبيق الجوال الذي طوروه لنا فاق كل التوقعات. فريق محترف، تسليم في الوقت المحدد، وتواصل ممتاز.",
    },
    rating: 5,
    photo: null,
  },
  {
    id: "testi3",
    name: { en: "Karim O.", ar: "كريم و." },
    role: { en: "Marketing Director, Al-Aqsa Corp", ar: "مدير التسويق، Al-Aqsa Corp" },
    quote: {
      en: "Our brand identity was completely reimagined by Next Vision. The logo, colors, and assets truly capture who we are.",
      ar: "أعادت Next Vision تصور هويتنا التجارية بالكامل. الشعار والألوان والعناصر تعبّر حقًا عن هويتنا.",
    },
    rating: 5,
    photo: null,
  },
  {
    id: "testi4",
    name: { en: "Lina H.", ar: "لينا ح." },
    role: { en: "E-commerce Owner", ar: "صاحبة متجر إلكتروني" },
    quote: {
      en: "I was skeptical at first, but Next Vision delivered beyond what I imagined. Highly recommend their services.",
      ar: "كنت متشككًا في البداية، لكن Next Vision قدّمت أكثر مما تخيلت. أنصح بشدة بخدماتهم.",
    },
    rating: 5,
    photo: null,
  },
];

const DEFAULT_MESSAGES = [];

const DEFAULT_CONTENT = {};

module.exports = { DEFAULT_SETTINGS, DEFAULT_PORTFOLIO, DEFAULT_TESTIMONIALS, DEFAULT_MESSAGES, DEFAULT_CONTENT };
