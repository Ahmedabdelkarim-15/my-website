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
    description: "قطن 100% مريح وخفيف لكل المواسم",
    price: 199,
    oldPrice: 280,
    category: "clothes",
    subcategory: "men",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    badge: "خصم",
    popular: true
  },
  {
    id: 2,
    name: "فستان صيفي نسائي أنيق",
    description: "تصميم عصري مناسب للخروجات والمناسبات",
    price: 350,
    oldPrice: null,
    category: "clothes",
    subcategory: "women",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    badge: null,
    popular: true
  },
  {
    id: 3,
    name: "بنطلون جينز رجالي سليم",
    description: "جينز مرن ومريح بقصة عصرية",
    price: 320,
    oldPrice: 400,
    category: "clothes",
    subcategory: "men",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    badge: "خصم",
    popular: false
  },
  {
    id: 4,
    name: "بلوزة حريمي شيفون",
    description: "خامة شيفون ناعمة بألوان هادئة",
    price: 180,
    oldPrice: null,
    category: "clothes",
    subcategory: "women",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=400&fit=crop",
    badge: null,
    popular: false
  },
  {
    id: 5,
    name: "طقم أطفال قطني مطبوع",
    description: "طقم مريح من القطن الطبيعي للأطفال",
    price: 150,
    oldPrice: 220,
    category: "clothes",
    subcategory: "kids",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop",
    badge: "خصم",
    popular: true
  },
  {
    id: 6,
    name: "جاكيت شتوي رجالي مبطن",
    description: "جاكيت دافئ ومقاوم للرياح",
    price: 550,
    oldPrice: null,
    category: "clothes",
    subcategory: "men",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    badge: "جديد",
    popular: false
  },

  // ═══════════════════════════════════════
  //  🍎 قسم المنتجات الغذائية (6 منتجات)
  // ═══════════════════════════════════════

  {
    id: 7,
    name: "أرز بسمتي فاخر 5 كيلو",
    description: "أرز بسمتي طويل الحبة عالي الجودة",
    price: 185,
    oldPrice: 220,
    category: "food",
    subcategory: "essentials",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    badge: "خصم",
    popular: true
  },
  {
    id: 8,
    name: "زيت زيتون بكر ممتاز 1 لتر",
    description: "زيت زيتون طبيعي معصور على البارد",
    price: 160,
    oldPrice: null,
    category: "food",
    subcategory: "essentials",
    image: "https://images.unsplash.com/photo-1474979266404-7eaabdf27cba?w=400&h=400&fit=crop",
    badge: null,
    popular: true
  },
  {
    id: 9,
    name: "عصير مانجو طبيعي 1 لتر",
    description: "عصير مانجو 100% بدون سكر مضاف",
    price: 45,
    oldPrice: null,
    category: "food",
    subcategory: "drinks",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop",
    badge: null,
    popular: false
  },
  {
    id: 10,
    name: "تونة معلبة عالية الجودة (6 علب)",
    description: "تونة خفيفة بزيت الزيتون - عبوة توفيرية",
    price: 210,
    oldPrice: 260,
    category: "food",
    subcategory: "canned",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    badge: "عرض",
    popular: true
  },
  {
    id: 11,
    name: "عسل نحل طبيعي جبلي 500 جم",
    description: "عسل نحل صافي من المناحل الطبيعية",
    price: 280,
    oldPrice: null,
    category: "food",
    subcategory: "essentials",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    badge: null,
    popular: false
  },
  {
    id: 12,
    name: "باكدج رمضان التوفيري الكبير",
    description: "أرز + زيت + سكر + شاي - كل الأساسيات",
    price: 450,
    oldPrice: 580,
    category: "food",
    subcategory: "bundle-offers",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=400&fit=crop",
    badge: "عرض خاص",
    popular: true
  },

  // ═══════════════════════════════════════
  //  🏠 قسم الأدوات المنزلية (6 منتجات)
  // ═══════════════════════════════════════

  {
    id: 13,
    name: "طقم أواني طهي جرانيت 7 قطع",
    description: "جرانيت ألماني مقاوم للالتصاق والخدش",
    price: 850,
    oldPrice: 1100,
    category: "home",
    subcategory: "kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    badge: "خصم",
    popular: true
  },
  {
    id: 14,
    name: "منظم أدراج متعدد الاستخدامات",
    description: "منظم عملي للمطبخ أو المكتب أو الحمام",
    price: 95,
    oldPrice: null,
    category: "home",
    subcategory: "organizers",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    badge: null,
    popular: false
  },
  {
    id: 15,
    name: "شمعة معطرة فاخرة بالفانيليا",
    description: "شمعة صويا طبيعية برائحة هادئة ومريحة",
    price: 120,
    oldPrice: null,
    category: "home",
    subcategory: "decor",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop",
    badge: null,
    popular: false
  },
  {
    id: 16,
    name: "خلاط كهربائي متعدد السرعات",
    description: "خلاط قوي 700 وات مع كوب زجاجي",
    price: 480,
    oldPrice: 620,
    category: "home",
    subcategory: "appliances",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop",
    badge: "خصم",
    popular: true
  },
  {
    id: 17,
    name: "طقم سكاكين ستانلس ستيل 5 قطع",
    description: "سكاكين احترافية مع حامل خشبي أنيق",
    price: 220,
    oldPrice: null,
    category: "home",
    subcategory: "kitchen",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop",
    badge: "جديد",
    popular: false
  },
  {
    id: 18,
    name: "مكنسة كهربائية يدوية صغيرة",
    description: "خفيفة وقوية الشفط لتنظيف سريع يومي",
    price: 650,
    oldPrice: 800,
    category: "home",
    subcategory: "appliances",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
    badge: "عرض",
    popular: true
  }
];
