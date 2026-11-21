/**
 * ======================================================
 *  بيانات منتجات متجر market.com
 * ======================================================
 *
 *  📌 تعليمات لصاحب المتجر:
 *  ─────────────────────────
 *  • لتغيير اسم المنتج: عدّل قيمة "name" بين علامتي التنصيص.
 *  • لتغيير السعر: عدّل الرقم بجانب "price".
 *  • لإضافة خصم: ضع السعر القديم في "oldPrice" والسعر الجديد في "price".
 *  • لتغيير الصورة: ضع رابط الصورة الجديدة في "image".
 *  • لإضافة منتج جديد: انسخ أي منتج بين { } وعدّل بياناته، وتأكد أن "id" رقم فريد.
 *  • لحذف منتج: احذف كل شيء من { حتى }, الخاصة به.
 *
 *  🏷️ الأقسام المتاحة (category):
 *     "clothes"   = ملابس
 *     "food"      = منتجات غذائية
 *     "home"      = أدوات منزلية
 *
 *  🏷️ الأقسام الفرعية (subcategory):
 *     ملابس:   "men" | "women" | "kids" | "offers"
 *     غذائية:  "essentials" | "drinks" | "canned" | "bundle-offers"
 *     منزلية:  "kitchen" | "organizers" | "decor" | "appliances"
 */

const PRODUCTS = [

  // ═══════════════════════════════════════
  //  🧥 قسم الملابس (6 منتجات)
  // ═══════════════════════════════════════

  {
    id: 1,
    name: "تيشيرت قطن رجالي كلاسيك",
    description: "قطن مصري 100% ناعم ومريح ومقاوم للانكماش",
    price: 199,
    oldPrice: 280,
    category: "clothes",
    subcategory: "men",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    badge: "خصم 29%",
    rating: 4.9,
    reviewsCount: 38,
    popular: true
  },
  {
    id: 2,
    name: "فستان صيفي نسائي أنيق",
    description: "خامة فسكوز ناعمة بنقوشات صيفية جذابة",
    price: 350,
    oldPrice: null,
    category: "clothes",
    subcategory: "women",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop",
    badge: "الأكثر مبيعاً",
    rating: 4.8,
    reviewsCount: 52,
    popular: true
  },
  {
    id: 3,
    name: "بنطلون جينز رجالي سليم ستريتش",
    description: "جينز مرن ومريح بقصة عصرية يدوم طويلاً",
    price: 320,
    oldPrice: 400,
    category: "clothes",
    subcategory: "men",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop",
    badge: "خصم 20%",
    rating: 4.7,
    reviewsCount: 29,
    popular: false
  },
  {
    id: 4,
    name: "بلوزة حريمي شيفون راقية",
    description: "خامة شيفون ناعمة بأكمام مريحة وألوان مميزة",
    price: 180,
    oldPrice: null,
    category: "clothes",
    subcategory: "women",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=600&fit=crop",
    badge: "جديد",
    rating: 4.6,
    reviewsCount: 19,
    popular: false
  },
  {
    id: 5,
    name: "طقم أطفال قطني قطعتين",
    description: "قطن طبيعي 100% مناسب لبشرة الأطفال الحساسة",
    price: 150,
    oldPrice: 220,
    category: "clothes",
    subcategory: "kids",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=600&fit=crop",
    badge: "خصم 31%",
    rating: 4.9,
    reviewsCount: 44,
    popular: true
  },
  {
    id: 6,
    name: "جاكيت شتوي ووتربروف مبطن",
    description: "مقاوم للمطر والرياح ببطانة داخلية دافئة جداً",
    price: 550,
    oldPrice: 680,
    category: "clothes",
    subcategory: "men",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
    badge: "عرض خاص",
    rating: 4.9,
    reviewsCount: 31,
    popular: false
  },

  // ═══════════════════════════════════════
  //  🍎 قسم المنتجات الغذائية (6 منتجات)
  // ═══════════════════════════════════════

  {
    id: 7,
    name: "أرز بسمتي هندي فاخر 5 كجم",
    description: "حبة طويلة بيضاء ناصعة بجودة استثنائية ونكهة غنية",
    price: 185,
    oldPrice: 220,
    category: "food",
    subcategory: "essentials",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop",
    badge: "خصم 16%",
    rating: 4.9,
    reviewsCount: 78,
    popular: true
  },
  {
    id: 8,
    name: "زيت زيتون بكر ممتاز 1 لتر",
    description: "معصور على البارد درجة أولى بنسبة حموضة أقل من 0.8%",
    price: 160,
    oldPrice: null,
    category: "food",
    subcategory: "essentials",
    image: "https://images.unsplash.com/photo-1474979266404-7eaabdf27cba?w=600&h=600&fit=crop",
    badge: "طبيعي 100%",
    rating: 5.0,
    reviewsCount: 63,
    popular: true
  },
  {
    id: 9,
    name: "عصير مانجو طبيعي طازج 1 لتر",
    description: "عصير مانجو مركز طبيعي بدون سكر صناعي مضاف",
    price: 45,
    oldPrice: null,
    category: "food",
    subcategory: "drinks",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=600&fit=crop",
    badge: "طازج",
    rating: 4.8,
    reviewsCount: 27,
    popular: false
  },
  {
    id: 10,
    name: "تونة قطع بزيت الزيتون (عرض 6 علب)",
    description: "تونة بيضاء فاخرة غنية بالأوميجا 3 عبوة توفير عائلية",
    price: 210,
    oldPrice: 260,
    category: "food",
    subcategory: "canned",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop",
    badge: "عرض توفير",
    rating: 4.9,
    reviewsCount: 91,
    popular: true
  },
  {
    id: 11,
    name: "عسل نحل جبلي حر طبيعي 500 جم",
    description: "عسل سدر جبلي نقي مضمون 100% ومفحوص معملياً",
    price: 280,
    oldPrice: 340,
    category: "food",
    subcategory: "essentials",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
    badge: "عضوي",
    rating: 5.0,
    reviewsCount: 84,
    popular: false
  },
  {
    id: 12,
    name: "كرتونة التوفير الغذائية الكبرى",
    description: "أرز + سكر + زيت ذرة + مكرونة + شاي + سمن بلدي",
    price: 450,
    oldPrice: 580,
    category: "food",
    subcategory: "bundle-offers",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=600&fit=crop",
    badge: "وفر 130 ج.م",
    rating: 4.9,
    reviewsCount: 112,
    popular: true
  },

  // ═══════════════════════════════════════
  //  🏠 قسم الأدوات المنزلية (6 منتجات)
  // ═══════════════════════════════════════

  {
    id: 13,
    name: "طقم حلل جرانيت ألماني 7 قطع",
    description: "طبقات مانعة للالتصاق مع أغطية زجاجية حرارية ومقابض سيليكون",
    price: 850,
    oldPrice: 1100,
    category: "home",
    subcategory: "kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
    badge: "خصم 250 ج.م",
    rating: 4.9,
    reviewsCount: 67,
    popular: true
  },
  {
    id: 14,
    name: "منظم أدراج وثلاجة أكريليك مقوى",
    description: "طقم منظمات شفافة متعددة المقاسات لترتيب أنيق وسهل",
    price: 95,
    oldPrice: null,
    category: "home",
    subcategory: "organizers",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&h=600&fit=crop",
    badge: "عملي جداً",
    rating: 4.7,
    reviewsCount: 35,
    popular: false
  },
  {
    id: 15,
    name: "شمعة معطرة فاخرة صويا طبيعي",
    description: "روائح الفانيليا واللافندر المهدئة تدوم لأكثر من 40 ساعة",
    price: 120,
    oldPrice: null,
    category: "home",
    subcategory: "decor",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop",
    badge: "ديكور",
    rating: 4.8,
    reviewsCount: 22,
    popular: false
  },
  {
    id: 16,
    name: "خلاط كهربائي 700 وات دورق زجاجي",
    description: "شفرات فولاذية مضادة للصدأ لسحق الثلج وتحضير العصائر بدقائق",
    price: 480,
    oldPrice: 620,
    category: "home",
    subcategory: "appliances",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop",
    badge: "ضمان سنتين",
    rating: 4.8,
    reviewsCount: 49,
    popular: true
  },
  {
    id: 17,
    name: "طقم سكاكين مطبخ ستانلس 5 قطع مع حامل",
    description: "شفرات حادة فائقة الجودة مع مسن وحامل خشبي مودرن",
    price: 220,
    oldPrice: null,
    category: "home",
    subcategory: "kitchen",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop",
    badge: "الأكثر طلباً",
    rating: 4.9,
    reviewsCount: 56,
    popular: false
  },
  {
    id: 18,
    name: "مكنسة يدوية لاسلكية قوية الشفط",
    description: "قابلة للشحن عبر USB مناسبة للمنزل والسيارة ببطارية طويلة الأمد",
    price: 650,
    oldPrice: 800,
    category: "home",
    subcategory: "appliances",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=600&fit=crop",
    badge: "خصم 150 ج.م",
    rating: 4.8,
    reviewsCount: 39,
    popular: true
  }
];
