/**
 * ======================================================
 *  بيانات منتجات متجر market.com المتطورة
 * ======================================================
 *  مستوحاة من كبرى المتاجر العالمية:
 *  • ملابس بمقاسات وألوان وخامات (على خطى H&M و SHEIN)
 *  • أغذية بأوزان ووحدات طازجة ومؤشرات جودة (على خطى Breadfast و Noon Minutes)
 *  • أدوات منزلية بمواصفات وضمان حقيقي
 * ======================================================
 */

const PRODUCTS = [

  // ═══════════════════════════════════════
  //  🧥 قسم الملابس (H&M & SHEIN Inspired)
  // ═══════════════════════════════════════

  {
    id: 1,
    name: "تيشيرت قطن مصري 100% كلاسيك فيت",
    description: "قطن مصري ممشط فائق النعومة، خياطة مزدوجة متينة تدوم بعد الغسيل المتكرر ولا تنكمش.",
    price: 199,
    oldPrice: 280,
    category: "clothes",
    subcategory: "men",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop"
    ],
    badge: "خصم 29%",
    rating: 4.9,
    reviewsCount: 38,
    popular: true,
    stockLeft: 4,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "أبيض ناصع", hex: "#ffffff" },
      { name: "أسود فحمي", hex: "#111827" },
      { name: "رمادي ميلانج", hex: "#9ca3af" }
    ],
    specs: {
      "الخامة": "100% قطن مصري أصلي",
      "القصّة": "Regular Fit مريح وعصري",
      "المناسبة": "كاجوال يومي لجميع الفصول",
      "بلد الصنع": "صنع بفخر في مصر 🇪🇬"
    }
  },
  {
    id: 2,
    name: "فستان صيفي نسائي مطرز بأكمام رقيقة",
    description: "قماش فسكوز طبيعي خفيف ومريح للغاية، تصميم صيفي راقٍ مستوحى من خطوط الموضة الأوروبية.",
    price: 350,
    oldPrice: 450,
    category: "clothes",
    subcategory: "women",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=600&fit=crop"
    ],
    badge: "الأكثر مبيعاً",
    rating: 4.8,
    reviewsCount: 52,
    popular: true,
    stockLeft: 2,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "بيج ناعم", hex: "#e5d5c5" },
      { name: "سماوي باستيل", hex: "#bfdbfe" }
    ],
    specs: {
      "الخامة": "فسكوز تركي بارد ومريح",
      "الطول": "ميدي أنيق",
      "المناسبة": "خروجات صيفية ومناسبات نهارية",
      "العناية": "غسيل بارد خفيف"
    }
  },
  {
    id: 3,
    name: "بنطلون جينز رجالي سليم ستريتش",
    description: "دينيم مرن عالي التحمل يعطيك حرية كاملة في الحركة مع مظهر رسمي وكاجوال في نفس الوقت.",
    price: 320,
    oldPrice: 400,
    category: "clothes",
    subcategory: "men",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop"
    ],
    badge: "خصم 20%",
    rating: 4.7,
    reviewsCount: 29,
    popular: false,
    stockLeft: 6,
    sizes: ["30", "32", "34", "36", "38"],
    colors: [
      { name: "أزرق داكن", hex: "#1e3a8a" },
      { name: "كحلي مدرج", hex: "#0f172a" }
    ],
    specs: {
      "الخامة": "98% قطن + 2% إيلاستين ستريتش",
      "القصة": "Slim Fit متناسقة",
      "المتانة": "أزرار وسحاب ياباني YKK أصلي"
    }
  },
  {
    id: 4,
    name: "بلوزة حريمي شيفون كاجوال أنيقة",
    description: "خامة شيفون حريرية ناعمة لا تتجعد بسهولة مع تفاصيل أنثوية على الياقة والأكمام.",
    price: 180,
    oldPrice: null,
    category: "clothes",
    subcategory: "women",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=600&fit=crop"
    ],
    badge: "جديد",
    rating: 4.6,
    reviewsCount: 19,
    popular: false,
    stockLeft: 8,
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "وردي ناعم", hex: "#fbcfe8" },
      { name: "أبيض لؤلؤي", hex: "#f8fafc" }
    ],
    specs: {
      "الخامة": "شيفون حريري خفيف",
      "المناسبة": "عمل، جامعة، وخروجات كاجوال"
    }
  },
  {
    id: 5,
    name: "طقم أطفال قطني قطعتين كاجوال",
    description: "طقم ولادي وبناتي مريح وآمن على بشرة الطفل، لا يسبب أي تحسس وخامات قطنية طبيعية 100%.",
    price: 150,
    oldPrice: 220,
    category: "clothes",
    subcategory: "kids",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=600&fit=crop"
    ],
    badge: "خصم 31%",
    rating: 4.9,
    reviewsCount: 44,
    popular: true,
    stockLeft: 5,
    sizes: ["سنة - سنتين", "3 - 4 سنوات", "5 - 6 سنوات"],
    colors: [
      { name: "أصفر مرح", hex: "#fde047" },
      { name: "أزرق هادئ", hex: "#93c5fd" }
    ],
    specs: {
      "الخامة": "قطن إنترلوك طبيعي ناعم جداً",
      "الأمان": "صبغات نباتية آمنة خالية من المواد الكيميائية"
    }
  },
  {
    id: 6,
    name: "جاكيت شتوي ووتربروف مبطن فرو حراري",
    description: "عزل كامل ضد الرياح والأمطار، تصميم أنيق مع جيوب متعددة وسحاب حماية عالي.",
    price: 550,
    oldPrice: 680,
    category: "clothes",
    subcategory: "men",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=600&fit=crop"
    ],
    badge: "عرض خاص",
    rating: 4.9,
    reviewsCount: 31,
    popular: false,
    stockLeft: 3,
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "زيتي عسكري", hex: "#3f4f34" },
      { name: "أسود مطفي", hex: "#1f2937" }
    ],
    specs: {
      "الطبقة الخارجية": "نايلون مضاد للماء Water-Repellent",
      "البطانة الداخلية": "فرو بولار فليس دافئ فائق العزل"
    }
  },

  // ═══════════════════════════════════════
  //  🍎 قسم المنتجات الغذائية (Noon Minutes & Breadfast Inspired)
  // ═══════════════════════════════════════

  {
    id: 7,
    name: "أرز بسمتي هندي سيلا فاخر",
    description: "أرز حبة طويلة معتقة 1121، يمنحك طعماً شهياً وأرزاً نثرياً فاخراً للعزائم اليومية والمناسبات.",
    price: 185,
    oldPrice: 220,
    category: "food",
    subcategory: "essentials",
    unit: "شيكارة 5 كجم",
    eta: "توصيل خلال 45 دقيقة ⚡",
    freshBadge: "طازج ومعتق 🌿",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop"
    ],
    badge: "وفر 35 ج.م",
    rating: 4.9,
    reviewsCount: 78,
    popular: true,
    stockLeft: 12,
    specs: {
      "الوزن": "5 كيلوجرام صافي",
      "نوع الحبة": "طويلة معتقة XXL درجة أولى",
      "بلد المنشأ": "الهند (معبأ في مصر بمواصفات قياسية)"
    }
  },
  {
    id: 8,
    name: "زيت زيتون سيناوي بكر ممتاز معصور بارد",
    description: "عصرة أولى على البارد بنسبة حموضة أقل من 0.5%، طبيعي 100% غني بمضادات الأكسدة للصحة والمناعة.",
    price: 160,
    oldPrice: null,
    category: "food",
    subcategory: "essentials",
    unit: "زجاجة داكنة 1 لتر",
    eta: "توصيل خلال 45 دقيقة ⚡",
    freshBadge: "عضوي 100% 🌿",
    image: "https://images.unsplash.com/photo-1474979266404-7eaabdf27cba?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1474979266404-7eaabdf27cba?w=600&h=600&fit=crop"
    ],
    badge: "طبيعي 100%",
    rating: 5.0,
    reviewsCount: 63,
    popular: true,
    stockLeft: 9,
    specs: {
      "الحجم": "1000 مل (1 لتر)",
      "طريقة العصر": "عصر هيدروليكي بارد بدون حرارة",
      "الاستخدام": "للسلطات، الطهي الصحي، والوقاية اليومية"
    }
  },
  {
    id: 9,
    name: "عصير مانجو فريش طبيعي بدون سكر",
    description: "مانجو سكري طازجة معصورة يومياً، خالية تماماً من المواد الحافظة والمحليات الصناعية.",
    price: 45,
    oldPrice: null,
    category: "food",
    subcategory: "drinks",
    unit: "عبوة 1 لتر عائلية",
    eta: "طازج اليوم — 45 دقيقة ⚡",
    freshBadge: "معصور اليوم 🥭",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=600&fit=crop"
    ],
    badge: "طازج اليوم",
    rating: 4.8,
    reviewsCount: 27,
    popular: false,
    stockLeft: 15,
    specs: {
      "المكونات": "مانجو طبيعية 100% ومياه نقية",
      "الصلاحية": "يحفظ مبرداً ويستهلك خلال 3 أيام"
    }
  },
  {
    id: 10,
    name: "تونة قطع بزيت الزيتون البكر (باكدج 6 علب)",
    description: "تونة صنفيش بيضاء فاخرة قطع كاملة، غنية بالأوميجا 3 والبروتين، عبوة توفير اقتصادية لعشاق الصحة.",
    price: 210,
    oldPrice: 260,
    category: "food",
    subcategory: "canned",
    unit: "6 علب × 170 جم",
    eta: "توصيل خلال 45 دقيقة ⚡",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop"
    ],
    badge: "عرض توفير",
    rating: 4.9,
    reviewsCount: 91,
    popular: true,
    stockLeft: 7,
    specs: {
      "العدد": "6 علب معدنية سهلة الفتح",
      "المكونات": "تونة أصلية صلبة، زيت زيتون بكر، ملح طعام خفيف"
    }
  },
  {
    id: 11,
    name: "عسل نحل جبلي حر سدر طبيعي 500 جم",
    description: "عسل سدر جبلي مفحوص معملياً، غني بالأنزيمات والمعادن المفيدة لرفع المناعة اليومية والنشاط.",
    price: 280,
    oldPrice: 340,
    category: "food",
    subcategory: "essentials",
    unit: "برطمان زجاجي 500 جم",
    eta: "توصيل خلال 45 دقيقة ⚡",
    freshBadge: "نقي 100% 🍯",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop"
    ],
    badge: "عضوي معتمد",
    rating: 5.0,
    reviewsCount: 84,
    popular: false,
    stockLeft: 5,
    specs: {
      "الوزن": "نصف كيلو (500 جم)",
      "المصدر": "مناحل جبلية طبيعية معتمدة"
    }
  },
  {
    id: 12,
    name: "كرتونة التوفير التموينية الكبرى (Breadfast Style)",
    description: "تحتوي على كل مستلزمات الشهر: 5 كجم أرز + 2 لتر زيت ذرة + 2 كجم سكر + 3 أكياس مكرونة + شاي وسمن بلدي.",
    price: 450,
    oldPrice: 580,
    category: "food",
    subcategory: "bundle-offers",
    unit: "كرتونة متكاملة 8 أصناف",
    eta: "شحن سريع خلال ساعتين 🚚",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=600&fit=crop"
    ],
    badge: "وفر 130 ج.م",
    rating: 4.9,
    reviewsCount: 112,
    popular: true,
    stockLeft: 8,
    specs: {
      "الأصناف": "أرز بسمتي، زيت ذرة نقي، سكر أبيض مكرر، مكرونة إيطاليانو، شاي سيلاني فاخر"
    }
  },

  // ═══════════════════════════════════════
  //  🏠 قسم الأدوات المنزلية (Modern Living)
  // ═══════════════════════════════════════

  {
    id: 13,
    name: "طقم حلل جرانيت ألماني 7 قطع مع أغطية حرارية",
    description: "طلاء جرانيت 5 طبقات غير لاصق وصحي 100% خالي من PFOA والرصاص، مقابض عازلة للحرارة وتوزيع حراري متساوٍ.",
    price: 850,
    oldPrice: 1100,
    category: "home",
    subcategory: "kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop"
    ],
    badge: "خصم 250 ج.م",
    rating: 4.9,
    reviewsCount: 67,
    popular: true,
    stockLeft: 2,
    colors: [
      { name: "رمادي حجري", hex: "#4b5563" },
      { name: "بني شيكولاتة", hex: "#78350f" }
    ],
    specs: {
      "القطع": "3 حلل مقاسات (18, 22, 26) + مقلاة 24 سم + 3 أغطية زجاج بايركس",
      "الضمان": "ضمان 3 سنوات ضد عيوب الصناعة"
    }
  },
  {
    id: 14,
    name: "طقم منظمات أدراج وثلاجة أكريليك مقوى (6 قطع)",
    description: "بلاستيك أكريليك شفاف شديد المتانة، يساعد على تنظيم الثلاجة والمطبخ بأعلى كفاءة وسهولة تنظيف.",
    price: 95,
    oldPrice: 130,
    category: "home",
    subcategory: "organizers",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop"
    ],
    badge: "عملي جداً",
    rating: 4.7,
    reviewsCount: 35,
    popular: false,
    stockLeft: 10,
    specs: {
      "العدد": "6 منظمات بأبعاد مختلفة",
      "الخامة": "أكريليك شفاف خالي من مادة BPA"
    }
  },
  {
    id: 15,
    name: "شمعة معطرة صويا طبيعي برائحة الفانيليا والعود",
    description: "شمعة ديكور عطرية فاخرة في وعاء زجاجي مصنفر، تدوم حتى 45 ساعة من الاحتراق الهادئ النظيف.",
    price: 120,
    oldPrice: null,
    category: "home",
    subcategory: "decor",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop"
    ],
    badge: "ديكور فاخر",
    rating: 4.8,
    reviewsCount: 22,
    popular: false,
    stockLeft: 14,
    specs: {
      "الخامة": "شمع صويا طبيعي 100% بفتيل قطني مزدوج",
      "وقت الاحتراق": "40 إلى 45 ساعة استرخاء"
    }
  },
  {
    id: 16,
    name: "خلاط كهربائي تورنادو 700 وات دورق زجاجي مقاوم",
    description: "محرك نحاسي قوي 700W مع 6 شفرات فولاذية مضادة للصدأ قادرة على جرش الثلج وتحضير أصعب العصائر.",
    price: 480,
    oldPrice: 620,
    category: "home",
    subcategory: "appliances",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop"
    ],
    badge: "ضمان سنتين",
    rating: 4.8,
    reviewsCount: 49,
    popular: true,
    stockLeft: 4,
    specs: {
      "القوة": "700 وات توربو حقيقي",
      "سعة الدورق": "1.75 لتر زجاج حراري متين",
      "الملحقات": "مطحنة توابل وبن منفصلة"
    }
  },
  {
    id: 17,
    name: "طقم سكاكين مطبخ ألماني 5 قطع مع حامل خشبي",
    description: "ستانلس ستيل كربوني حاد يدوم مدى الحياة، تصميم هندسي يريح اليد أثناء التقطيع المستمر.",
    price: 220,
    oldPrice: null,
    category: "home",
    subcategory: "kitchen",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop"
    ],
    badge: "الأكثر طلباً",
    rating: 4.9,
    reviewsCount: 56,
    popular: false,
    stockLeft: 8,
    specs: {
      "العدد": "5 سكاكين استخدامات مختلفة + مسن ستيل + حامل خشب طبيعي"
    }
  },
  {
    id: 18,
    name: "مكنسة يدوية لاسلكية ذكية قوية الشفط USB-C",
    description: "قوة شفط فائقة 12000Pa لتنظيف زوايا المنزل والسيارة، بطارية ليثيوم قابلة لإعادة الشحن عبر Type-C.",
    price: 650,
    oldPrice: 800,
    category: "home",
    subcategory: "appliances",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=600&fit=crop"
    ],
    badge: "خصم 150 ج.م",
    rating: 4.8,
    reviewsCount: 39,
    popular: true,
    stockLeft: 3,
    specs: {
      "قوة الشفط": "12000 باسكال توربو",
      "البطارية": "4000mAh تدوم حتى 40 دقيقة عمل متواصل"
    }
  }
];

// قائمة أكواد الخصم التفاعلية المعتمدة في المتجر
const PROMO_CODES = {
  "WELCOME10": { type: "percent", value: 10, label: "خصم 10% ترحيبي", minTotal: 0 },
  "MARKET20": { type: "percent", value: 20, label: "خصم 20% للطلبات الكبرى", minTotal: 400 },
  "FREESHIP": { type: "shipping", value: 0, label: "شحن وتوصيل مجاني", minTotal: 250 },
  "EGYPT50": { type: "fixed", value: 50, label: "خصم فوري 50 ج.م", minTotal: 300 }
};
