/**
 * ======================================================
 *  market.com — محرك اللغات (عربي / English)
 * ======================================================
 *  • قاموس ترجمة كامل لواجهة المتجر والمنتجات
 *  • زر تبديل اللغة في الهيدر مع حفظ الاختيار
 *  • قلب الاتجاه RTL/LTR تلقائياً
 *  • دالة t() لترجمة أي نص عربي إلى الإنجليزية
 * ======================================================
 */
window.I18N = (function () {
  'use strict';

  const STORAGE_KEY = 'market_lang';
  let lang = 'ar';
  try {
    lang = localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ar';
  } catch (e) {}

  const listeners = [];

  /* ═══════════════════════════════════════
     قاموس الترجمة: عربي → English
     ═══════════════════════════════════════ */
  const DICT = {
    /* ─── عام / الهيدر / التنقل ─── */
    'الرئيسية': 'Home',
    'الملابس والأزياء': 'Fashion & Clothing',
    'سوبرماركت وأغذية': 'Supermarket & Food',
    'الأدوات المنزلية والديكور': 'Homeware & Decor',
    'عروض التوفير الأسبوعية': 'Weekly Savings Deals',
    'الكوبونات': 'Coupons',
    'طلباتي': 'My Orders',
    'المساعدة': 'Help',
    'المفضلة': 'Favorites',
    'السلة': 'Cart',
    'الملابس · الأغذية · المنزل': 'Fashion · Food · Home',
    'market.com الرئيسية': 'market.com Home',
    'ابحث عن الملابس، الخضار، السلع التموينية، أو الأدوات المنزلية...': 'Search clothes, groceries, essentials, or homeware...',
    'مسح البحث': 'Clear search',
    'كوبونات وعروض الخصم': 'Coupons & discount deals',
    'طلباتي وتتبع الشحنة': 'My orders & shipment tracking',
    'الدعم الفني والتواصل': 'Support & contact',
    'قائمة المفضلة': 'Favorites list',
    'سلة المشتريات': 'Shopping cart',

    /* ─── شريط الإعلانات ─── */
    'توصيل سوبر سريع': 'Super-fast delivery',
    'خلال 45 - 60 دقيقة في نطاق القاهرة والجيزة': 'within 45 - 60 minutes across Cairo & Giza',
    'كود خصم ترحيبي:': 'Welcome discount code:',
    '(خصم 10% فوري)': '(instant 10% off)',
    'دفع آمن: كاش، محافظ ذكية، إنستاباي، وبطاقات بنكية': 'Secure payment: cash, mobile wallets, InstaPay & bank cards',

    /* ─── الهيرو والأقسام ─── */
    'تجربة تسوق عصرية بمعايير عالمية وسرعة فائقة': 'A modern shopping experience with world-class standards and super speed',
    'كل ما تحتاجه أسرتك في مكان واحد مع': 'Everything your family needs in one place with',
    'تشكيلة راقية من أحدث صيحات الموضة، السلع الغذائية والتموينية الطازجة المعصورة يومياً، وأرقى مستلزمات المطبخ والمنزل بأسعار منافسة وتوصيل فوري.': 'A premium selection of the latest fashion, fresh daily groceries, and the finest kitchen & home essentials at competitive prices with instant delivery.',
    'توصيل سريع 45 دقيقة': '45-minute fast delivery',
    'طازج لباب البيت في القاهرة والجيزة': 'Fresh to your doorstep in Cairo & Giza',
    'كاش أو إلكتروني': 'Cash or electronic',
    'إنستاباي، فودافون كاش، وبطاقات بنكية': 'InstaPay, Vodafone Cash & bank cards',
    'أكواد خصم وتوفير': 'Discount codes & savings',
    'خصومات حقيقية تصل إلى 30%': 'Real discounts up to 30%',
    'تصفح القسم': 'Browse category',
    'اسم القسم': 'Category name',
    'وصف مميز للقسم وجودة المنتجات المعروضة فيه': 'A special description of the category and the quality of its products',
    'الأقسام الرئيسية': 'Main Categories',
    'تسوّق حسب الأقسام المميزة': 'Shop by Featured Categories',
    'تصميم متطور وتجربة سهلة وسريعة مستوحاة من أشهر المتاجر العالمية': 'A modern design and an easy, fast experience inspired by the world\'s top stores',
    'أزياء وموضة راقية': 'Premium fashion & style',
    'مقاسات متعددة من S إلى XXL مع خامات قطنية مصرية 100%': 'Sizes S to XXL in 100% Egyptian cotton',
    'تصفح الأزياء': 'Browse fashion',
    'سوبرماركت فوري طازج': 'Fresh instant supermarket',
    'طازج يومياً، سلع تموينية، مشروبات طبيعية وكراتين توفير': 'Fresh daily, pantry staples, natural juices & savings bundles',
    'تسوّق البقالة': 'Shop groceries',
    'البيت العصري': 'The modern home',
    'أطقم طهي جرانيت ألماني، منظمات ذكية، وأجهزة منزلية بضمان': 'German granite cookware sets, smart organizers & warranted appliances',
    'تصفح المنزل': 'Browse home',
    'خصومات اليوم الحصرية': 'Today\'s exclusive discounts',
    'عروض التوفير الكبرى': 'Big Savings Deals',
    'عرض كل التخفيضات': 'View all discounts',
    'الأكثر طلباً الآن': 'Most in-demand now',
    'اختيارات عملائنا المفضلة': 'Our customers\' favorite picks',

    /* ─── بيانات الأقسام الديناميكية ─── */
    'المنتجات الغذائية والسوبرماركت': 'Groceries & Supermarket',
    'أناقة وجودة عالية': 'Style & premium quality',
    'طازج وسريع لباب البيت': 'Fresh & fast to your door',
    'لمنزلك العصري الأنيق': 'For your stylish modern home',
    'تخفيضات لفترة محدودة': 'Limited-time discounts',
    'أحدث صيحات الموضة والأزياء الرجالية والنسائية وملابس الأطفال بخامات قطنية ممتازة وتصميمات تناسب كل الأوقات.': 'The latest men\'s, women\'s and kids\' fashion in premium cotton fabrics with designs for every occasion.',
    'كل ما تحتاجه مائدتك من السلع التموينية الأساسية، الزيوت النقية، المشروبات الطبيعية، والمعلبات وكراتين التوفير.': 'Everything your table needs: pantry staples, pure oils, natural drinks, canned goods & savings bundles.',
    'أطقم الطهي الجرانيت، المنظمات الذكية، أجهزة المطبخ الكهربائية، والديكورات العصرية لمنزل أكثر ترتيباً وراحة.': 'Granite cookware sets, smart organizers, electric kitchen appliances & modern decor for a tidier, cozier home.',
    'أقوى التخفيضات والخصومات الأسبوعية على كافة الأقسام مع ضمان أعلى قيمة مقابل أفضل سعر.': 'The strongest weekly discounts across all categories with the best value-for-money guarantee.',

    /* ─── الفلاتر الفرعية والترتيب ─── */
    'جميع الملابس': 'All clothing',
    'رجالي': 'Men',
    'حريمي': 'Women',
    'أطفال': 'Kids',
    'عروض وتخفيضات': 'Deals & discounts',
    'جميع المنتجات': 'All products',
    'أساسيات وتموين': 'Essentials & pantry',
    'مشروبات وعصائر': 'Drinks & juices',
    'معلبات وتونة': 'Canned & tuna',
    'كراتين التوفير': 'Savings bundles',
    'جميع الأدوات': 'All items',
    'أدوات ومستلزمات مطبخ': 'Kitchen tools & essentials',
    'منظمات وترتيب': 'Organizers & storage',
    'ديكور وشموع': 'Decor & candles',
    'أجهزة كهربائية': 'Electric appliances',
    'كل العروض': 'All deals',
    'عروض الملابس': 'Fashion deals',
    'عروض الأغذية': 'Food deals',
    'عروض المنزل': 'Home deals',
    'ترتيب:': 'Sort:',
    'الأكثر شعبية وطلباً': 'Most popular',
    'السعر: من الأقل للأعلى': 'Price: low to high',
    'السعر: من الأعلى للأقل': 'Price: high to low',
    'الأعلى تقييماً': 'Top rated',
    'عنوان القسم': 'Category title',
    '0 منتج': '0 items',
    '0 طلب': '0 orders',
    'نتائج البحث': 'Search results',
    'نتائج فورية': 'Instant results',
    'العودة للرئيسية': 'Back to home',
    'لا توجد منتجات مطابقة حالياً': 'No matching products right now',
    'جرب تغيير خيارات البحث أو تصفح الأقسام الأخرى للاطلاع على أحدث العروض': 'Try changing your search or browse other categories for the latest deals',

    /* ─── بطاقة المنتج / المعاينة السريعة ─── */
    'ملابس وأزياء': 'Fashion',
    'سوبرماركت': 'Supermarket',
    'أدوات منزلية': 'Homeware',
    'سوبرماركت ومنتجات غذائية': 'Supermarket & groceries',
    'معاينة سريعة': 'Quick view',
    'أضف للسلة': 'Add to cart',
    'أضف إلى السلة': 'Add to cart',
    'تمت الإضافة': 'Added',
    'إضافة للمفضلة': 'Add to favorites',
    'إزالة من المفضلة': 'Remove from favorites',
    'شراء فوري': 'Buy now',
    'المقاس المتاح:': 'Available sizes:',
    'دليل المقاسات': 'Size guide',
    'اللون المختار:': 'Selected color:',
    'القسم': 'Category',
    'اسم المنتج': 'Product name',
    '(35 مراجعة)': '(35 reviews)',
    'متبقي 3 قطع فقط في المخزن': 'Only 3 left in stock',
    '0 ج.م': '0 EGP',
    '- 0 ج.م': '- 0 EGP',
    'اسم حامل البطاقة': 'Card holder name',
    'تاريخ الانتهاء': 'Expiry date',
    'عرض خاص': 'Special offer',

    /* ─── سلة المشتريات ─── */
    'سلتك فارغة حالياً': 'Your cart is empty',
    'استكشف أفضل المنتجات والعروض وأضف ما تحتاجه بكل سهولة': 'Explore the best products and deals, and add what you need with ease',
    'ابدأ التسوق الآن': 'Start shopping now',
    'أدخل كود الخصم (مثال: WELCOME10)': 'Enter discount code (e.g. WELCOME10)',
    'تطبيق': 'Apply',
    'تم تفعيل كود:': 'Code activated:',
    'إلغاء الكود': 'Remove code',
    'تصفح الكوبونات المتاحة': 'Browse available coupons',
    'المجموع الفرعي:': 'Subtotal:',
    'قيمة الخصم:': 'Discount:',
    'رسوم الشحن (القاهرة والجيزة):': 'Shipping (Cairo & Giza):',
    'مجاني': 'Free',
    'الإجمالي النهائي:': 'Final total:',
    'الانتقال لصفحة الدفع الآمن': 'Proceed to secure checkout',
    'إغلاق السلة': 'Close cart',
    'حذف': 'Remove',
    'تقليل': 'Decrease',
    'زيادة': 'Increase',
    'المقاس:': 'Size:',
    'اللون:': 'Color:',

    /* ─── صفحة الدفع (Checkout) ─── */
    'إتمام الطلب والدفع الآمن — market.com': 'Checkout & secure payment | market.com',
    'اتصال مشفر بالكامل 256-bit SSL': 'Fully encrypted 256-bit SSL connection',
    'إغلاق الدفع': 'Close checkout',
    'العنوان والتوصيل': 'Address & delivery',
    'طريقة الدفع': 'Payment method',
    'تأكيد الفاتورة': 'Confirm invoice',
    '1. بيانات المستلم وعنوان التوصيل': '1. Recipient details & delivery address',
    'الاسم الكامل *': 'Full name *',
    'مثال: أحمد عبد الكريم': 'e.g. Ahmed Abdelkarim',
    'يرجى كتابة الاسم بالكامل': 'Please enter the full name',
    'رقم هاتف التواصل والواتساب *': 'Contact & WhatsApp number *',
    'مثال: 01143950895': 'e.g. 01143950895',
    'يرجى إدخال رقم هاتف مصري صحيح (11 رقم)': 'Please enter a valid Egyptian phone number (11 digits)',
    'عنوان التوصيل بالتفصيل (المنطقة / الشارع / رقم العقار) *': 'Full delivery address (district / street / building no.) *',
    'مثال: 18 شارع مصدق، الدقي، الجيزة - عمارة 5 الدور 3': 'e.g. 18 Mesdaq St, Dokki, Giza - Bldg 5, 3rd floor',
    'يرجى كتابة العنوان التفصيلي بدقة': 'Please enter the detailed address accurately',
    'ملاحظات خاصة بمندوب الشحن (اختياري)': 'Notes for the courier (optional)',
    'مثال: يرجى الاتصال قبل الوصول بنصف ساعة': 'e.g. Please call 30 minutes before arrival',
    'حفظ هذا العنوان لملء البيانات تلقائياً في طلباتي القادمة بنقرة واحدة': 'Save this address to auto-fill my future orders in one tap',
    '2. وسيلة الدفع': '2. Payment method',
    'الدفع عند الاستلام (كاش)': 'Cash on delivery (COD)',
    'المعاينة أولاً والدفع نقداً عند الاستلام': 'Inspect first, then pay cash on delivery',
    'محافظ ذكية (فودافون كاش / اتصالات / WE)': 'Mobile wallets (Vodafone Cash / Etisalat / WE)',
    'تحويل فوري لرقم محفظة المتجر 01143950895': 'Instant transfer to the store wallet 01143950895',
    'إنستاباي / تحويل بنكي فوري': 'InstaPay / instant bank transfer',
    'عبر معرف إنستاباي: market@instapay': 'Via InstaPay handle: market@instapay',
    'بطاقة بنكية / Paymob (فيزا / ماستركارد / ميزة)': 'Bank card / Paymob (Visa / Mastercard / Meeza)',
    'بوابة دفع Paymob المعتمدة والمشفرة محلياً': 'Paymob\'s certified, locally encrypted gateway',
    'Stripe (دفع دولي / Apple Pay)': 'Stripe (international / Apple Pay)',
    'بوابة Stripe العالمية للبطاقات والدفع الرقمي': 'Stripe\'s global gateway for cards & digital payment',
    'يرجى تحويل المبلغ الإجمالي إلى رقم محفظة فودافون كاش الرسمية للمتجر:': 'Please transfer the total amount to the store\'s official Vodafone Cash wallet:',
    'نسخ الرقم': 'Copy number',
    'رقم المحفظة التي قمت بالتحويل منها (لتأكيد العملية):': 'The wallet number you transferred from (to confirm):',
    'مثال: 010xxxxxxxx': 'e.g. 010xxxxxxxx',
    'معرف إنستاباي الفوري (InstaPay IPA):': 'Instant InstaPay handle (IPA):',
    'نسخ المعرف': 'Copy handle',
    'اسم صاحب الحساب أو الرقم المرجعي للتحويل:': 'Account holder name or transfer reference:',
    'مثال: أحمد عبد الكريم / مرجع التحويل': 'e.g. Ahmed Abdelkarim / transfer reference',
    'رقم البطاقة (16 رقم)': 'Card number (16 digits)',
    'تاريخ الصلاحية': 'Expiry date',
    'رمز الأمان (CVV)': 'Security code (CVV)',
    'بوابة دفع Stripe العالمية': 'Stripe global payment gateway',
    'سيتم توجيهك فور النقر على "تأكيد الطلب والدفع" إلى صفحة الدفع المؤمنة بتقنيات 3D Secure لتمرير العملية بسلاسة.': 'Once you tap "Confirm order & pay" you will be redirected to a 3D Secure payment page to complete the process smoothly.',
    'ملخص الطلب': 'Order summary',
    'هل لديك كود خصم؟': 'Have a discount code?',
    'اكتب كود الخصم هنا': 'Type the discount code here',
    'الكود مفعل:': 'Code active:',
    'قيمة الخصم المطبق:': 'Applied discount:',
    'مصاريف الشحن السريع:': 'Express shipping fee:',
    'الإجمالي المستحق للدفع:': 'Total due:',
    'تأكيد الطلب وإرسال الفاتورة الرسمية': 'Confirm order & send official invoice',
    'ضمان استبدال واسترجاع مجاني 14 يوماً من market.com': 'Free 14-day exchange & return guarantee from market.com',
    'الكمية:': 'Qty:',

    /* ─── سجل الطلبات ─── */
    'سجل طلباتي وتتبع الشحنات': 'My orders & shipment tracking',
    'طلباتي السابقة': 'My previous orders',
    'لا توجد طلبات سابقة حتى الآن': 'No previous orders yet',
    'عند تأكيد أي طلب عبر المتجر، سيتم حفظه هنا لتتمكن من متابعة حالته وإعادة طلبه بنقرة واحدة': 'Any confirmed order will be saved here so you can track it and reorder in one tap',
    'تصفح المنتجات الآن': 'Browse products now',
    'إغلاق': 'Close',
    'تم التأكيد': 'Confirmed',
    'جاري التجهيز': 'Preparing',
    'مع المندوب': 'With courier',
    'تم التسليم': 'Delivered',
    'الأصناف:': 'Items:',
    'الإجمالي:': 'Total:',
    'إعادة الطلب': 'Reorder',
    'طلب رقم:': 'Order no.:',

    /* ─── الكوبونات ─── */
    'كوبونات وأكواد الخصم المتاحة': 'Available coupons & discount codes',
    'نسخ وتطبيق': 'Copy & apply',
    '10% خصم': '10% OFF',
    'خصم 10% ترحيبي لجميع العملاء بدون حد أدنى للطلب': '10% welcome discount for all customers, no minimum order',
    '20% خصم': '20% OFF',
    'خصم 20% للطلبات الكبرى التي تتجاوز 400 ج.م': '20% off orders over 400 EGP',
    'شحن مجاني': 'Free shipping',
    'توصيل وشحن مجاني لجميع مناطق القاهرة والجيزة (فوق 250 ج.م)': 'Free delivery across Cairo & Giza (orders over 250 EGP)',
    '50 ج.م': '50 EGP',
    'خصم فوري 50 ج.م على المشتريات فوق 300 ج.م': 'Instant 50 EGP off purchases over 300 EGP',
    'خصم 10% ترحيبي': '10% welcome discount',
    'خصم 20% للطلبات الكبرى': '20% off large orders',
    'شحن وتوصيل مجاني': 'Free shipping & delivery',
    'خصم فوري 50 ج.م': 'Instant 50 EGP off',

    /* ─── المفضلة ─── */
    'لا توجد منتجات في المفضلة': 'No favorites yet',
    'اضغط على أيقونة القلب على أي منتج لحفظه والرجوع إليه لاحقاً بسهولة': 'Tap the heart icon on any product to save it and come back later',
    'إضافة جميع المفضلة للسلة': 'Add all favorites to cart',
    'إغلاق المفضلة': 'Close favorites',

    /* ─── الدعم ─── */
    'مركز الدعم والتواصل': 'Support & contact center',
    'إغلاق الدعم': 'Close support',
    'فريق market.com جاهز لمساعدتك': 'The market.com team is ready to help',
    'متاحون يومياً للرد على استفساراتكم وتتبع الشحنات بكل اهتمام': 'Available daily to answer your questions and track shipments with care',
    'تواصل فوري عبر واتساب': 'Instant WhatsApp contact',
    'اتصال هاتفي: 01143950895': 'Call us: 01143950895',
    'ساعات العمل الرسمية': 'Official working hours',
    'يومياً من 9:00 ص إلى 11:00 م': 'Daily 9:00 AM to 11:00 PM',
    'سرعة التوصيل': 'Delivery speed',
    'خلال 45 - 60 دقيقة في القاهرة والجيزة': 'Within 45 - 60 minutes in Cairo & Giza',
    'الأسئلة الأكثر شيوعاً': 'Frequently asked questions',
    'كيف استخدم كود الخصم في الطلب؟': 'How do I use a discount code?',
    'يمكنك كتابة كود الخصم (مثل WELCOME10 أو MARKET20) في خانة كود الخصم داخل سلة المشتريات أو في صفحة الدفع والضغط على "تطبيق"، وسيتم خصم القيمة فوراً من الإجمالي.': 'Type your code (e.g. WELCOME10 or MARKET20) in the discount field in your cart or at checkout and tap "Apply"; the value is deducted instantly from your total.',
    'ما هي وسائل الدفع المدعومة؟': 'What payment methods are supported?',
    'نوفر الدفع نقداً عند الاستلام (كاش)، المحافظ الذكية (فودافون كاش، اتصالات، أورنج، WE)، الدفع عبر إنستاباي والحسابات البنكية، والبطاقات الائتمانية والبنكية (فيزا، ماستركارد، وميزة الوطنية).': 'We support cash on delivery, mobile wallets (Vodafone Cash, Etisalat, Orange, WE), InstaPay & bank transfers, and bank cards (Visa, Mastercard & Meeza).',
    'كيف يمكنني معاينة الملابس واختيار المقاس؟': 'How can I preview clothes and pick a size?',
    'نوفر ميزة المعاينة السريعة لاختيار المقاس (S, M, L, XL, XXL) واللون المناسب، كما يمكنك معاينة الشحنة بالكامل عند باب بيتك قبل دفع أي مبالغ.': 'Use Quick View to pick a size (S, M, L, XL, XXL) and color, and you can fully inspect your shipment at your door before paying anything.',
    'تواصل معنا': 'Contact us',
    'تواصل مع الدعم الفني': 'Contact support',
    'العودة للأعلى': 'Back to top',
    'تمت العملية بنجاح': 'Done successfully',

    /* ─── الفوتر ─── */
    'المتجر الإلكتروني الرائد في مصر للملابس والأزياء العصرية، مستلزمات البقالة والتموين السريعة، والأدوات المنزلية الذكية. سرعة وثقة وضمان وجودة 100%.': 'Egypt\'s leading online store for modern fashion, fast groceries & essentials, and smart homeware. Speed, trust, warranty & 100% quality.',
    'فودافون كاش ومحافظ': 'Vodafone Cash & wallets',
    'إنستاباي InstaPay': 'InstaPay',
    'دفع عند الاستلام': 'Cash on delivery',
    'بطاقة ميزة الوطنية': 'Meeza national card',
    'قسم الملابس والأزياء': 'Fashion & clothing section',
    'سوبرماركت ومنتجات غذائية': 'Supermarket & groceries',
    'الأدوات المنزلية والمطبخ': 'Homeware & kitchen',
    'تتبع طلباتي السابقة': 'Track my previous orders',
    'أكواد وكوبونات الخصم': 'Discount codes & coupons',
    'مركز الدعم والمساعدة': 'Help & support center',
    'واتساب الدعم المباشر': 'Direct support WhatsApp',
    'لوحة تحكم التاجر (/admin)': 'Merchant dashboard (/admin)',
    'خدمة العملاء': 'Customer service',
    'ضمانات المتجر': 'Store guarantees',
    'معاينة الطلب قبل الدفع': 'Inspect your order before paying',
    'استرجاع مجاني 14 يوماً': 'Free 14-day returns',
    'توصيل سوبر سريع 45 دقيقة': 'Super-fast 45-minute delivery',
    'ضمان جودة المنتجات 100%': '100% product quality guarantee',
    '© 2026 جميع الحقوق محفوظة لمتجر': '© 2026 All rights reserved to',
    '— فخر التجارة الإلكترونية المصرية 🇪🇬': '| the pride of Egyptian e-commerce 🇪🇬',

    /* ─── صفحة نجاح الطلب ─── */
    'تم استلام طلبك بنجاح!': 'Your order was received successfully!',
    'شكراً لتسوقك من Market.com. تم إرسال تفاصيل طلبك إلى نظام المتجر وسيتم تجهيزه للشحن فوراً.': 'Thanks for shopping at Market.com. Your order details were sent to the store system and will be prepared for shipping right away.',
    'رقم الطلب الخاص بك:': 'Your order number:',
    'تم تأكيد العملية بنجاح': 'Order confirmed successfully',
    'تم تسجيل وسيلة الدفع واعتماد الطلب في النظام.': 'Payment method recorded and order approved in the system.',
    'تجهيز وتغليف الطلب': 'Preparing & packing your order',
    'فريقنا يجهز منتجاتك بعناية مع فحص الجودة خلال ساعات قليلة.': 'Our team carefully prepares your products with a quality check within a few hours.',
    'التوصيل السريع (القاهرة والجيزة)': 'Fast delivery (Cairo & Giza)',
    'سيتواصل معك مندوب الشحن على هاتفك لتسليم الشحنة في الموعد المحدد.': 'The courier will call you to deliver your shipment on time.',
    'متابعة التسوق': 'Continue shopping',
    'تواصل مع الدعم عبر واتساب': 'Contact support on WhatsApp',
    'تم الدفع بنجاح عبر بوابة Paymob (بطاقة بنكية / محفظة إلكترونية).': 'Paid successfully via Paymob (bank card / e-wallet).',
    'تم الدفع بنجاح عبر بوابة Stripe المعتمدة دولياً.': 'Paid successfully via the internationally certified Stripe gateway.',

    /* ─── Toast وتنبيهات ديناميكية ─── */
    'يرجى كتابة كود الخصم أولاً ⚠️': 'Please type a discount code first ⚠️',
    'تم إلغاء كود الخصم': 'Discount code removed',
    'سلة المشتريات فارغة حالياً ⚠️': 'Your cart is empty ⚠️',
    'يرجى تصحيح أخطاء العنوان والبيانات الشخصية ⚠️': 'Please fix the address & personal details errors ⚠️',
    'تمت إضافة عناصر الطلب السابق إلى السلة بنجاح 🔄': 'Previous order items added to cart 🔄',
    'تم نقل جميع عناصر المفضلة إلى السلة 🛍️': 'All favorites moved to cart 🛍️',
    'تم النسخ!': 'Copied!',
    'تم نسخ الرقم للحافظة بنجاح ✅': 'Number copied to clipboard ✅',
    'دليل المقاسات: S (صدر 96سم)، M (صدر 102سم)، L (صدر 108سم)، XL (صدر 114سم)، XXL (صدر 120سم)': 'Size guide: S (96cm chest), M (102cm), L (108cm), XL (114cm), XXL (120cm)',
    'ميزة': 'Meeza',
    'مرحباً، أود الاستفسار عن حالة طلبي رقم #': 'Hello, I would like to ask about my order #',
    'المنتجات الغذائية': 'Groceries & Food',
    'الأدوات المنزلية': 'Homeware',
    'سنة - سنتين': '1 - 2 years',
    '3 - 4 سنوات': '3 - 4 years',
    '5 - 6 سنوات': '5 - 6 years',
    'market.com — تسوق الملابس، الأغذية، والأدوات المنزلية': 'market.com | Shop fashion, food & homeware',
    'market.com — متجرك الإلكتروني الشامل للملابس، المنتجات الغذائية، والأدوات المنزلية بأسعار مناسبة وتوصيل فوري للقاهرة والجيزة.': 'market.com | Your complete online store for fashion, groceries & homeware at great prices with instant delivery across Cairo & Giza.',

    /* ═════════ المنتجات: الأسماء ═════════ */
    'تيشيرت قطن مصري 100% كلاسيك فيت': 'Classic-Fit 100% Egyptian Cotton T-Shirt',
    'فستان صيفي نسائي مطرز بأكمام رقيقة': 'Embroidered Summer Dress with Delicate Sleeves',
    'بنطلون جينز رجالي سليم ستريتش': 'Men\'s Slim-Stretch Jeans',
    'بلوزة حريمي شيفون كاجوال أنيقة': 'Elegant Casual Chiffon Blouse',
    'طقم أطفال قطني قطعتين كاجوال': 'Kids\' Casual 2-Piece Cotton Set',
    'جاكيت شتوي ووتربروف مبطن فرو حراري': 'Waterproof Winter Jacket with Thermal Fleece Lining',
    'أرز بسمتي هندي سيلا فاخر': 'Premium Indian Sella Basmati Rice',
    'زيت زيتون سيناوي بكر ممتاز معصور بارد': 'Cold-Pressed Extra-Virgin Sinai Olive Oil',
    'عصير مانجو فريش طبيعي بدون سكر': 'Fresh Natural Mango Juice, No Added Sugar',
    'تونة قطع بزيت الزيتون البكر (باكدج 6 علب)': 'Tuna Chunks in Virgin Olive Oil (6-Can Pack)',
    'عسل نحل جبلي حر سدر طبيعي 500 جم': 'Pure Mountain Sidr Honey 500g',
    'كرتونة التوفير التموينية الشهرية الكبرى': 'Monthly Grocery Savings Box (Large)',
    'طقم حلل جرانيت ألماني 7 قطع مع أغطية حرارية': 'German Granite Cookware Set, 7 pcs with Thermal Lids',
    'طقم منظمات أدراج وثلاجة أكريليك مقوى (6 قطع)': 'Reinforced Acrylic Drawer & Fridge Organizer Set (6 pcs)',
    'شمعة معطرة صويا طبيعي برائحة الفانيليا والعود': 'Natural Soy Scented Candle, Vanilla & Oud',
    'خلاط كهربائي تورنادو 700 وات دورق زجاجي مقاوم': 'Tornado 700W Electric Blender with Heatproof Glass Jug',
    'طقم سكاكين مطبخ ألماني 5 قطع مع حامل خشبي': 'German Kitchen Knife Set, 5 pcs with Wooden Block',
    'مكنسة يدوية لاسلكية ذكية قوية الشفط USB-C': 'Smart Cordless Handheld Vacuum, USB-C Strong Suction',

    /* ═════════ المنتجات: الأوصاف ═════════ */
    'قطن مصري ممشط فائق النعومة، خياطة مزدوجة متينة تدوم بعد الغسيل المتكرر ولا تنكمش.': 'Super-soft combed Egyptian cotton with durable double stitching that lasts and never shrinks after washing.',
    'قماش فسكوز طبيعي خفيف ومريح للغاية، تصميم صيفي راقٍ مستوحى من خطوط الموضة الأوروبية.': 'Very light natural viscose fabric, an elegant summer design inspired by European fashion lines.',
    'دينيم مرن عالي التحمل يعطيك حرية كاملة في الحركة مع مظهر رسمي وكاجوال في نفس الوقت.': 'Durable stretch denim that gives you full freedom of movement with a smart-casual look.',
    'خامة شيفون حريرية ناعمة لا تتجعد بسهولة مع تفاصيل أنثوية على الياقة والأكمام.': 'Soft silky chiffon that resists wrinkles, with feminine details on the collar and sleeves.',
    'طقم ولادي وبناتي مريح وآمن على بشرة الطفل، لا يسبب أي تحسس وخامات قطنية طبيعية 100%.': 'A comfy boys\' & girls\' set, safe on kids\' skin, hypoallergenic, in 100% natural cotton.',
    'عزل كامل ضد الرياح والأمطار، تصميم أنيق مع جيوب متعددة وسحاب حماية عالي.': 'Full wind & rain insulation, an elegant design with multiple pockets and a high protective zipper.',
    'أرز حبة طويلة معتقة 1121، يمنحك طعماً شهياً وأرزاً نثرياً فاخراً للعزائم اليومية والمناسبات.': 'Aged 1121 long-grain rice for a delicious taste and fluffy premium rice, daily or for occasions.',
    'عصرة أولى على البارد بنسبة حموضة أقل من 0.5%، طبيعي 100% غني بمضادات الأكسدة للصحة والمناعة.': 'First cold press with acidity under 0.5%, 100% natural, rich in antioxidants for health & immunity.',
    'مانجو سكري طازجة معصورة يومياً، خالية تماماً من المواد الحافظة والمحليات الصناعية.': 'Fresh Sukkari mango squeezed daily, completely free of preservatives and artificial sweeteners.',
    'تونة صنفيش بيضاء فاخرة قطع كاملة، غنية بالأوميجا 3 والبروتين، عبوة توفير اقتصادية لعشاق الصحة.': 'Premium white Sunfish tuna in whole chunks, rich in omega-3 & protein, in an economy saver pack.',
    'عسل سدر جبلي مفحوص معملياً، غني بالأنزيمات والمعادن المفيدة لرفع المناعة اليومية والنشاط.': 'Lab-tested mountain Sidr honey, rich in enzymes & minerals for daily immunity and energy.',
    'تحتوي على كل مستلزمات الشهر: 5 كجم أرز + 2 لتر زيت ذرة + 2 كجم سكر + 3 أكياس مكرونة + شاي وسمن بلدي.': 'All your monthly staples: 5kg rice + 2L corn oil + 2kg sugar + 3 pasta packs + tea & local ghee.',
    'طلاء جرانيت 5 طبقات غير لاصق وصحي 100% خالي من PFOA والرصاص، مقابض عازلة للحرارة وتوزيع حراري متساوٍ.': '5-layer non-stick healthy granite coating, PFOA- & lead-free, heat-insulated handles & even heat distribution.',
    'بلاستيك أكريليك شفاف شديد المتانة، يساعد على تنظيم الثلاجة والمطبخ بأعلى كفاءة وسهولة تنظيف.': 'Ultra-durable clear acrylic that organizes your fridge & kitchen efficiently and cleans easily.',
    'شمعة ديكور عطرية فاخرة في وعاء زجاجي مصنفر، تدوم حتى 45 ساعة من الاحتراق الهادئ النظيف.': 'A luxury aromatic decor candle in a frosted glass jar, lasting up to 45 hours of clean burning.',
    'محرك نحاسي قوي 700W مع 6 شفرات فولاذية مضادة للصدأ قادرة على جرش الثلج وتحضير أصعب العصائر.': 'A powerful 700W copper motor with 6 rust-proof steel blades that crush ice & the toughest blends.',
    'ستانلس ستيل كربوني حاد يدوم مدى الحياة، تصميم هندسي يريح اليد أثناء التقطيع المستمر.': 'Razor-sharp carbon stainless steel that lasts a lifetime, ergonomically designed for long prep sessions.',
    'قوة شفط فائقة 12000Pa لتنظيف زوايا المنزل والسيارة، بطارية ليثيوم قابلة لإعادة الشحن عبر Type-C.': 'Powerful 12000Pa suction for home & car corners, with a rechargeable lithium battery via Type-C.',

    /* ═════════ المنتجات: الألوان ═════════ */
    'أبيض ناصع': 'Bright white',
    'أسود فحمي': 'Charcoal black',
    'رمادي ميلانج': 'Melange grey',
    'بيج ناعم': 'Soft beige',
    'سماوي باستيل': 'Pastel sky blue',
    'أزرق داكن': 'Dark blue',
    'كحلي مدرج': 'Gradient navy',
    'وردي ناعم': 'Soft pink',
    'أبيض لؤلؤي': 'Pearl white',
    'أصفر مرح': 'Cheerful yellow',
    'أزرق هادئ': 'Calm blue',
    'زيتي عسكري': 'Military olive',
    'أسود مطفي': 'Matte black',
    'رمادي حجري': 'Stone grey',
    'بني شيكولاتة': 'Chocolate brown',

    /* ═════════ المنتجات: الشارات ═════════ */
    'خصم 29%': '29% OFF',
    'خصم 20%': '20% OFF',
    'خصم 31%': '31% OFF',
    'الأكثر مبيعاً': 'Best seller',
    'الأكثر طلباً': 'Most wanted',
    'جديد': 'New',
    'وفر 35 ج.م': 'Save 35 EGP',
    'وفر 130 ج.م': 'Save 130 EGP',
    'خصم 250 ج.م': '250 EGP OFF',
    'خصم 150 ج.م': '150 EGP OFF',
    'طبيعي 100%': '100% natural',
    'طازج اليوم': 'Fresh today',
    'عرض توفير': 'Saver deal',
    'عضوي معتمد': 'Certified organic',
    'عملي جداً': 'Super practical',
    'ديكور فاخر': 'Luxury decor',
    'ضمان سنتين': '2-year warranty',
    'توصيل خلال 45 دقيقة ⚡': 'Delivered in 45 min ⚡',
    'طازج اليوم — 45 دقيقة ⚡': 'Fresh today | 45 min ⚡',
    'شحن سريع خلال ساعتين 🚚': 'Express shipping in 2 hrs 🚚',

    /* ═════════ المنتجات: المواصفات (مفاتيح) ═════════ */
    'الخامة': 'Material',
    'القصّة': 'Fit',
    'القصة': 'Fit',
    'المناسبة': 'Occasion',
    'بلد الصنع': 'Made in',
    'الطول': 'Length',
    'العناية': 'Care',
    'الأمان': 'Safety',
    'المتانة': 'Durability',
    'الطبقة الخارجية': 'Outer layer',
    'البطانة الداخلية': 'Inner lining',
    'الوزن': 'Weight',
    'نوع الحبة': 'Grain type',
    'بلد المنشأ': 'Origin',
    'الحجم': 'Size',
    'طريقة العصر': 'Press method',
    'الاستخدام': 'Usage',
    'المكونات': 'Ingredients',
    'الصلاحية': 'Shelf life',
    'العدد': 'Count',
    'المصدر': 'Source',
    'الأصناف': 'Contents',
    'القطع': 'Pieces',
    'الضمان': 'Warranty',
    'وقت الاحتراق': 'Burn time',
    'القوة': 'Power',
    'سعة الدورق': 'Jug capacity',
    'الملحقات': 'Attachments',
    'قوة الشفط': 'Suction power',
    'البطارية': 'Battery',

    /* ═════════ المنتجات: المواصفات (قيم) ═════════ */
    '100% قطن مصري أصلي': '100% authentic Egyptian cotton',
    'Regular Fit مريح وعصري': 'Comfortable modern Regular Fit',
    'كاجوال يومي لجميع الفصول': 'Everyday casual for all seasons',
    'صنع بفخر في مصر 🇪🇬': 'Proudly made in Egypt 🇪🇬',
    'فسكوز تركي بارد ومريح': 'Cool, comfy Turkish viscose',
    'ميدي أنيق': 'Elegant midi',
    'خروجات صيفية ومناسبات نهارية': 'Summer outings & daytime occasions',
    'غسيل بارد خفيف': 'Gentle cold wash',
    '98% قطن + 2% إيلاستين ستريتش': '98% cotton + 2% stretch elastane',
    'Slim Fit متناسقة': 'Tailored Slim Fit',
    'أزرار وسحاب ياباني YKK أصلي': 'Genuine Japanese YKK buttons & zipper',
    'شيفون حريري خفيف': 'Light silky chiffon',
    'عمل، جامعة، وخروجات كاجوال': 'Work, campus & casual outings',
    'قطن إنترلوك طبيعي ناعم جداً': 'Ultra-soft natural interlock cotton',
    'صبغات نباتية آمنة خالية من المواد الكيميائية': 'Safe plant-based dyes, chemical-free',
    'نايلون مضاد للماء Water-Repellent': 'Water-repellent nylon',
    'فرو بولار فليس دافئ فائق العزل': 'Super-insulating warm polar fleece',
    '5 كيلوجرام صافي': 'Net 5 kg',
    'طويلة معتقة XXL درجة أولى': 'Aged XXL long grain, first grade',
    'الهند (معبأ في مصر بمواصفات قياسية)': 'India (packed in Egypt to standard specs)',
    '1000 مل (1 لتر)': '1000 ml (1 litre)',
    'عصر هيدروليكي بارد بدون حرارة': 'Cold hydraulic press, no heat',
    'للسلطات، الطهي الصحي، والوقاية اليومية': 'For salads, healthy cooking & daily wellness',
    'مانجو طبيعية 100% ومياه نقية': '100% natural mango & pure water',
    'يحفظ مبرداً ويستهلك خلال 3 أيام': 'Keep refrigerated, consume within 3 days',
    '6 علب معدنية سهلة الفتح': '6 easy-open metal cans',
    'تونة أصلية صلبة، زيت زيتون بكر، ملح طعام خفيف': 'Solid premium tuna, virgin olive oil, light salt',
    'نصف كيلو (500 جم)': 'Half a kilo (500 g)',
    'مناهل جبلية طبيعية معتمدة': 'Certified natural mountain apiaries',
    'أرز بسمتي، زيت ذرة نقي، سكر أبيض مكرر، مكرونة إيطاليانو، شاي سيلاني فاخر': 'Basmati rice, pure corn oil, refined white sugar, Italiano pasta, premium Ceylon tea',
    '3 حلل مقاسات (18, 22, 26) + مقلاة 24 سم + 3 أغطية زجاج بايركس': '3 pots (18, 22, 26cm) + 24cm pan + 3 Pyrex glass lids',
    'ضمان 3 سنوات ضد عيوب الصناعة': '3-year warranty against manufacturing defects',
    '6 منظمات بأبعاد مختلفة': '6 organizers in assorted sizes',
    'أكريليك شفاف خالي من مادة BPA': 'Clear BPA-free acrylic',
    'شمع صويا طبيعي 100% بفتيل قطني مزدوج': '100% natural soy wax with double cotton wick',
    '40 إلى 45 ساعة استرخاء': '40 to 45 hours of relaxation',
    '700 وات توربو حقيقي': 'True 700W turbo',
    '1.75 لتر زجاج حراري متين': '1.75L durable thermal glass',
    'مطحنة توابل وبن منفصلة': 'Separate spice & coffee grinder',
    '5 سكاكين استخدامات مختلفة + مسن ستيل + حامل خشب طبيعي': '5 knives for different uses + steel sharpener + natural wood block',
    '12000 باسكال توربو': '12000 Pascal turbo',
    '4000mAh تدوم حتى 40 دقيقة عمل متواصل': '4000mAh, up to 40 minutes of continuous use'
  };

  /* ═══════════════════════════════════════
     رسائل مركّبة (مع متغيرات)
     ═══════════════════════════════════════ */
  const msg = {
    items: (n) => lang === 'en' ? `${n} ${n === 1 ? 'item' : 'items'}` : `${n} منتج`,
    orders: (n) => lang === 'en' ? `${n} ${n === 1 ? 'order' : 'orders'}` : `${n} طلب`,
    reviews: (n) => lang === 'en' ? `(${n} reviews)` : `(${n} مراجعة)`,
    stock: (n) => lang === 'en' ? `Only ${n} left in stock` : `متبقي ${n} قطع فقط في المخزن`,
    discountPct: (n) => lang === 'en' ? `${n}% OFF` : `خصم ${n}%`,
    addedToCart: (name) => lang === 'en' ? `"${name}" added to cart 🛍️` : `تمت إضافة "${name}" إلى السلة 🛍️`,
    removedFromFav: (name) => lang === 'en' ? `"${name}" removed from favorites` : `تمت إزالة "${name}" من المفضلة`,
    addedToFav: (name) => lang === 'en' ? `"${name}" added to favorites ❤️` : `تمت إضافة "${name}" إلى المفضلة ❤️`,
    promoApplied: (code) => lang === 'en' ? `Discount code "${code}" applied! 🎉` : `تم تطبيق كود الخصم "${code}" بنجاح! 🎉`,
    promoInvalid: (code) => lang === 'en' ? `Sorry, code "${code}" is invalid or expired ❌` : `عذراً، كود الخصم "${code}" غير صالح أو منتهي الصلاحية ❌`,
    promoMin: (min, cur) => lang === 'en' ? `This code requires a minimum order of ${min} ${cur} ⚠️` : `هذا الكود يتطلب حداً أدنى للطلب بقيمة ${min} ${cur} ⚠️`,
    searchTitle: (q, n) => lang === 'en' ? `Search results for "${q}" (${msg.items(n)})` : `نتائج البحث عن "${q}" (${msg.items(n)})`,
    confirming: () => lang === 'en' ? 'Confirming order & processing payment...' : 'جاري تأكيد الطلب ومعالجة الدفع...',
    waInvoicePaid: () => lang === 'en' ? '🏦 InstaPay / instant bank transfer' : '🏦 إنستاباي / تحويل بنكي فوري',
    waInvoiceCod: () => lang === 'en' ? '💵 Cash on delivery' : '💵 الدفع عند الاستلام نقداً (كاش)',
    waInvoice: (o) => {
      if (lang === 'en') {
        let m = `🛍️ *Confirmed order invoice — ${o.storeName}*\n`;
        m += `Order no.: *#${o.orderNumber}*\n`;
        m += `Amount due: ${o.grandTotal} ${o.currency}\n`;
        m += `Payment: ${o.paymentDesc}\n`;
        m += `Customer: ${o.name} (${o.phone})\nAddress: ${o.address}\n`;
        return m;
      }
      let m = `🛍️ *فاتورة طلب معتمد — متجر ${o.storeName}*\n`;
      m += `رقم الطلب: *#${o.orderNumber}*\n`;
      m += `المبلغ المستحق: ${o.grandTotal} ${o.currency}\n`;
      m += `طريقة الدفع: ${o.paymentDesc}\n`;
      m += `العميل: ${o.name} (${o.phone})\nالعنوان: ${o.address}\n`;
      return m;
    },
    waFallback: (o) => lang === 'en'
      ? `🛍️ *New order — ${o.storeName}*\nOrder no.: *#${o.orderNumber}*\nTotal: ${o.grandTotal} ${o.currency}\nCustomer: ${o.name} (${o.phone})`
      : `🛍️ *طلب جديد — متجر ${o.storeName}*\nرقم الطلب: *#${o.orderNumber}*\nالإجمالي: ${o.grandTotal} ${o.currency}\nالعميل: ${o.name} (${o.phone})`
  };
  /* ── لوحة تحكم التاجر (admin) ── */
  Object.assign(DICT, {
    'لوحة تحكم التاجر | Market.com': 'Merchant Dashboard | Market.com',
    'بوابة إدارة المتجر': 'Store admin portal',
    'سجّل دخولك للوصول للطلبات والمبيعات وبوابات الدفع': 'Sign in to access orders, sales, and payment gateways',
    'اسم المستخدم': 'Username',
    'كلمة المرور': 'Password',
    'دخول للوحة التحكم': 'Sign in to dashboard',
    'كلمة المرور:': 'Password:',
    'الرجوع للمتجر': 'Back to store',
    'لوحة التاجر': 'Merchant dashboard',
    'التحديث التلقائي كل 15 ثانية': 'Auto-refresh every 15 seconds',
    'تحديث حي': 'Live refresh',
    'تحديث البيانات': 'Refresh data',
    'معاينة المتجر كعميل': 'Preview store as customer',
    'عرض المتجر': 'View store',
    'المسؤول': 'Admin',
    'تسجيل الخروج': 'Sign out',
    'خروج': 'Sign out',
    'مرحباً، لوحة إدارة الطلبات والمبيعات': 'Welcome to the orders and sales dashboard',
    'متابعة فورية للطلبات الواردة، عمليات الدفع عبر Paymob و Stripe، والإشعارات': 'Live view of incoming orders, Paymob and Stripe payments, and notifications',
    'إجمالي المبيعات المدفوعة': 'Total paid sales',
    'معاملات مكتملة وناجحة': 'Completed successful transactions',
    'الطلبات المدفوعة': 'Paid orders',
    'جاهزة للتجهيز والشحن': 'Ready for packing and shipping',
    'طلبات قيد الانتظار': 'Pending orders',
    'بانتظار تأكيد الدفع أو الاستلام': 'Awaiting payment or pickup confirmation',
    'متوسط قيمة الطلب': 'Average order value',
    'AOV للمبيعات الناجحة': 'AOV of successful sales',
    '0.00 ج.م': '0.00 EGP',
    'الكل (': 'All (',
    'المدفوعة (': 'Paid (',
    'قيد الانتظار (': 'Pending (',
    'لم تكتمل (': 'Incomplete (',
    'بحث برقم الطلب، اسم العميل، أو الهاتف...': 'Search by order number, customer name, or phone...',
    'جميع بوابات الدفع': 'All payment gateways',
    'Paymob (بطاقة / محفظة)': 'Paymob (card / wallet)',
    'Stripe (دولي)': 'Stripe (international)',
    'الدفع عند الاستلام (COD)': 'Cash on delivery (COD)',
    'قائمة الطلبات المباشرة': 'Live orders list',
    'تصدير CSV': 'Export CSV',
    'رقم الطلب': 'Order no.',
    'العميل والاتصال': 'Customer & contact',
    'العنوان والمدينة': 'Address & city',
    'المنتجات': 'Items',
    'الإجمالي': 'Total',
    'بوابة الدفع': 'Payment gateway',
    'حالة الدفع': 'Payment status',
    'التاريخ والوقت': 'Date & time',
    'الإجراءات': 'Actions',
    'جاري تحميل الطلبات...': 'Loading orders...',
    'لا توجد طلبات تطابق هذا التصنيف': 'No orders match this filter',
    'ستظهر الطلبات الجديدة هنا فور قيام العملاء بالشراء': 'New orders appear here as soon as customers buy',
    'تفاصيل الطلب الكاملة': 'Full order details',
    'طباعة الفاتورة': 'Print invoice',
    'تحديث الحالة:': 'Update status:',
    'تأكيد كـ مدفوع': 'Mark as paid',
    'تم تفعيل التحديث التلقائي': 'Auto-refresh enabled',
    'تم إيقاف التحديث التلقائي': 'Auto-refresh disabled',
    'جاري التحقق...': 'Checking...',
    'فشل تسجيل الدخول': 'Sign-in failed',
    'مرحباً بك! تم تسجيل الدخول بنجاح': 'Welcome! Signed in successfully',
    'تم تسجيل الخروج بنجاح': 'Signed out successfully',
    'متصل وجاهز للعمليات': 'Connected and ready',
    'في وضع المحاكاة أو بانتظار المفاتيح': 'Demo mode or awaiting keys',
    'منتجات': 'items',
    'بدون اسم': 'No name',
    'القاهرة': 'Cairo',
    'محادثة واتساب': 'WhatsApp chat',
    'عند الاستلام': 'Cash on delivery',
    'مدفوع ✅': 'Paid ✅',
    'قيد الانتظار': 'Pending',
    'ملغي / فشل': 'Canceled / failed',
    'تفاصيل': 'Details',
    'مقاس:': 'Size:',
    'لون:': 'Color:',
    'بيانات العميل والتوصيل': 'Customer & delivery details',
    'اسم العميل:': 'Customer name:',
    'رقم الهاتف:': 'Phone number:',
    'واتساب': 'WhatsApp',
    'المدينة:': 'City:',
    'عنوان التوصيل:': 'Delivery address:',
    'ملاحظات التوصيل:': 'Delivery notes:',
    'بيانات الدفع والعملية': 'Payment & transaction details',
    'بوابة الدفع:': 'Payment gateway:',
    'حالة الدفع الحالية:': 'Current payment status:',
    'رقم المرجع / Transaction ID:': 'Reference / Transaction ID:',
    'المنتجات المطلوبة': 'Ordered items',
    'لا توجد منتجات': 'No items',
    'خصم الكوبون': 'Coupon discount',
    'كوبون': 'coupon',
    'الإجمالي المستحق:': 'Amount due:',
    'فشل التحديث': 'Update failed',
    'حدث خطأ أثناء التحديث': 'An error occurred while updating',
    'لا توجد طلبات للتصدير': 'No orders to export',
    'تم تصدير ملف CSV بنجاح': 'CSV exported successfully'
  });

  /* ═══════════════════════════════════════
     الواجهة البرمجية
     ═══════════════════════════════════════ */
  function t(s) {
    if (lang === 'ar' || s === null || s === undefined) return s;
    return Object.prototype.hasOwnProperty.call(DICT, s) ? DICT[s] : s;
  }
  function cur() { return lang === 'en' ? 'EGP' : 'ج.م'; }
  function isEn() { return lang === 'en'; }
  function getLang() { return lang; }
  function onChange(fn) { if (typeof fn === 'function') listeners.push(fn); }

  /* ─── ترجمة DOM الثابتة ─── */
  const origTexts = new WeakMap();
  const origAttrs = new WeakMap();
  const ATTRS = ['placeholder', 'title', 'aria-label'];

  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }

  function translateTextNode(node, toEn) {
    if (toEn) {
      const original = node.nodeValue;
      const key = norm(original);
      if (!key || !/[؀-ۿ]/.test(key)) return;
      if (!origTexts.has(node)) origTexts.set(node, original);
      const en = DICT[key];
      if (en !== undefined) {
        const lead = original.match(/^\s*/)[0];
        const trail = original.match(/\s*$/)[0];
        node.nodeValue = lead + en + trail;
      }
    } else if (origTexts.has(node)) {
      node.nodeValue = origTexts.get(node);
    }
  }

  function applyStatic(toEn) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => translateTextNode(n, toEn));

    document.querySelectorAll('*').forEach(el => {
      ATTRS.forEach(attr => {
        const val = el.getAttribute && el.getAttribute(attr);
        if (val === null || val === undefined || val === '') return;
        let store = origAttrs.get(el);
        if (!store) { store = {}; origAttrs.set(el, store); }
        if (toEn) {
          if (!(attr in store)) store[attr] = val;
          if (!/[؀-ۿ]/.test(val)) return;
          const en = DICT[norm(val)];
          if (en !== undefined) el.setAttribute(attr, en);
        } else if (attr in store) {
          el.setAttribute(attr, store[attr]);
        }
      });
    });

    /* العنوان والوصف */
    if (!applyStatic._origTitle) {
      applyStatic._origTitle = document.title;
      const m = document.querySelector('meta[name="description"]');
      if (m) applyStatic._origDesc = m.getAttribute('content');
    }
    if (toEn) {
      const enTitle = DICT[norm(applyStatic._origTitle)];
      if (enTitle !== undefined) document.title = enTitle;
      const m = document.querySelector('meta[name="description"]');
      if (m && applyStatic._origDesc) {
        const enDesc = DICT[norm(applyStatic._origDesc)];
        if (enDesc !== undefined) m.setAttribute('content', enDesc);
      }
    } else {
      document.title = applyStatic._origTitle;
      const m = document.querySelector('meta[name="description"]');
      if (m && applyStatic._origDesc) m.setAttribute('content', applyStatic._origDesc);
    }
  }

  /* ─── زر تبديل اللغة ─── */
  let toggleBtn = null;
  function updateToggle() {
    if (!toggleBtn) return;
    const label = toggleBtn.querySelector('.action-btn-label');
    if (label) label.textContent = lang === 'en' ? 'عربي' : 'English';
    toggleBtn.title = lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English';
    toggleBtn.setAttribute('aria-label', toggleBtn.title);
  }

  function injectToggle() {
    toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'action-btn lang-toggle-btn';
    toggleBtn.id = 'langToggleBtn';
    toggleBtn.innerHTML = '<i class="fa-solid fa-globe"></i> <span class="action-btn-label"></span>';
    toggleBtn.addEventListener('click', () => setLang(lang === 'en' ? 'ar' : 'en'));

    const actions = document.querySelector('.header-actions');
    if (actions) {
      actions.insertBefore(toggleBtn, actions.firstChild);
    } else {
      toggleBtn.classList.add('lang-toggle-floating');
      document.body.appendChild(toggleBtn);
    }
    updateToggle();
  }

  /* ─── تغيير اللغة ─── */
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ar';
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    applyStatic(lang === 'en');
    updateToggle();
    listeners.forEach(fn => { try { fn(lang); } catch (e) { console.error(e); } });
  }

  /* ─── التهيئة ─── */
  function boot() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    injectToggle();
    if (lang === 'en') applyStatic(true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  return {
    t: t,
    msg: msg,
    cur: cur,
    isEn: isEn,
    getLang: getLang,
    setLang: setLang,
    onChange: onChange
  };
})();
