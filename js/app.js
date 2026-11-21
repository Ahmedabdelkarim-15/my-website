/**
 * ======================================================
 *  market.com — Advanced eCommerce Engine
 * ======================================================
 *  • Dedicated Checkout Modal (Shopify Plus Style)
 *  • Interactive Promo Code / Coupon Engine
 *  • Quick View Modal with Sizes & Colors
 *  • Freshness Badges & Fast Delivery Ticker
 *  • Order Tracking & History (Local Backend Simulator)
 *  • Strict XSS Sanitization
 * ======================================================
 */

(function () {
  'use strict';

  /* ─── إعدادات وثوابت المتجر ─── */
  const STORE_CONFIG = {
    whatsappNumber: '201143950895',
    storeName: 'market.com',
    currency: 'ج.م',
    deliveryArea: 'القاهرة والجيزة',
    standardShippingFee: 35,
    freeShippingThreshold: 350
  };

  /* ─── بيانات وعناوين الأقسام ─── */
  const CATEGORIES_DATA = {
    clothes: {
      name: 'الملابس والأزياء',
      tag: 'أناقة وجودة عالية',
      desc: 'أحدث صيحات الموضة والأزياء الرجالية والنسائية وملابس الأطفال بخامات قطنية ممتازة وتصميمات تناسب كل الأوقات.',
      themeClass: 'theme-clothes',
      bannerClass: 'banner-clothes'
    },
    food: {
      name: 'المنتجات الغذائية والسوبرماركت',
      tag: 'طازج وسريع لباب البيت',
      desc: 'كل ما تحتاجه مائدتك من السلع التموينية الأساسية، الزيوت النقية، المشروبات الطبيعية، والمعلبات وكراتين التوفير.',
      themeClass: 'theme-food',
      bannerClass: 'banner-food'
    },
    homeware: {
      name: 'الأدوات المنزلية والديكور',
      tag: 'لمنزلك العصري الأنيق',
      desc: 'أطقم الطهي الجرانيت، المنظمات الذكية، أجهزة المطبخ الكهربائية، والديكورات العصرية لمنزل أكثر ترتيباً وراحة.',
      themeClass: 'theme-homeware',
      bannerClass: 'banner-homeware'
    },
    offers: {
      name: 'عروض التوفير الكبرى',
      tag: 'تخفيضات لفترة محدودة',
      desc: 'أقوى التخفيضات والخصومات الأسبوعية على كافة الأقسام مع ضمان أعلى قيمة مقابل أفضل سعر.',
      themeClass: 'theme-offers',
      bannerClass: 'banner-offers'
    }
  };

  const SUBCATEGORY_LABELS = {
    clothes: [
      { key: 'all', label: 'جميع الملابس' },
      { key: 'men', label: 'رجالي' },
      { key: 'women', label: 'حريمي' },
      { key: 'kids', label: 'أطفال' },
      { key: 'offers', label: 'عروض وتخفيضات' }
    ],
    food: [
      { key: 'all', label: 'جميع المنتجات' },
      { key: 'essentials', label: 'أساسيات وتموين' },
      { key: 'drinks', label: 'مشروبات وعصائر' },
      { key: 'canned', label: 'معلبات وتونة' },
      { key: 'bundle-offers', label: 'كراتين التوفير' }
    ],
    home: [
      { key: 'all', label: 'جميع الأدوات' },
      { key: 'kitchen', label: 'أدوات ومستلزمات مطبخ' },
      { key: 'organizers', label: 'منظمات وترتيب' },
      { key: 'decor', label: 'ديكور وشموع' },
      { key: 'appliances', label: 'أجهزة كهربائية' }
    ],
    offers: [
      { key: 'all', label: 'كل العروض' },
      { key: 'clothes', label: 'عروض الملابس' },
      { key: 'food', label: 'عروض الأغذية' },
      { key: 'home', label: 'عروض المنزل' }
    ]
  };

  /* ─── عناصر DOM ─── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // عناصر الهيدر
  const header = $('#header');
  const searchInput = $('#searchInput');
  const clearSearchBtn = $('#clearSearchBtn');
  const logoHome = $('#logoHome');

  // أزرار الهيدر
  const cartBtn = $('#cartBtn');
  const cartCount = $('#cartCount');
  const favBtn = $('#favBtn');
  const favCount = $('#favCount');
  const supportBtn = $('#supportBtn');
  const trackOrdersBtn = $('#trackOrdersBtn');
  const ordersCount = $('#ordersCount');
  const openCouponsBtn = $('#openCouponsBtn');

  // الأدراج
  const drawerOverlay = $('#drawerOverlay');
  const cartDrawer = $('#cartDrawer');
  const cartClose = $('#cartClose');
  const favDrawer = $('#favDrawer');
  const favClose = $('#favClose');
  const supportDrawer = $('#supportDrawer');
  const supportClose = $('#supportClose');
  const ordersDrawer = $('#ordersDrawer');
  const ordersClose = $('#ordersClose');

  // عناصر السلة
  const cartItemsEl = $('#cartItems');
  const cartEmpty = $('#cartEmpty');
  const cartFooter = $('#cartFooter');
  const cartSubtotalEl = $('#cartSubtotal');
  const cartDiscountRow = $('#cartDiscountRow');
  const cartDiscountAmount = $('#cartDiscountAmount');
  const cartShippingAmount = $('#cartShippingAmount');
  const cartTotalEl = $('#cartTotal');
  const cartDrawerCount = $('#cartDrawerCount');
  const proceedBtn = $('#proceedBtn');
  const startShoppingBtn = $('#startShoppingBtn');

  // كود الخصم بالسلة
  const cartPromoInput = $('#cartPromoInput');
  const cartApplyPromoBtn = $('#cartApplyPromoBtn');
  const appliedPromoTag = $('#appliedPromoTag');
  const promoCodeName = $('#promoCodeName');
  const removePromoBtn = $('#removePromoBtn');
  const viewCouponsFromCart = $('#viewCouponsFromCart');

  // نافذة إتمام الطلب المخصصة (Checkout Modal)
  const checkoutModal = $('#checkoutModal');
  const closeCheckoutModal = $('#closeCheckoutModal');
  const modalCustName = $('#modalCustName');
  const modalCustPhone = $('#modalCustPhone');
  const modalCustAddress = $('#modalCustAddress');
  const modalCustNotes = $('#modalCustNotes');
  const saveAddressCheckbox = $('#saveAddressCheckbox');
  const modalCartItemsList = $('#modalCartItemsList');
  const modalSubtotal = $('#modalSubtotal');
  const modalDiscountRow = $('#modalDiscountRow');
  const modalDiscountAmount = $('#modalDiscountAmount');
  const modalShippingAmount = $('#modalShippingAmount');
  const modalGrandTotal = $('#modalGrandTotal');
  const confirmCheckoutBtn = $('#confirmCheckoutBtn');

  const modalPromoInput = $('#modalPromoInput');
  const modalApplyPromoBtn = $('#modalApplyPromoBtn');
  const modalAppliedPromoTag = $('#modalAppliedPromoTag');
  const modalPromoCodeName = $('#modalPromoCodeName');
  const modalRemovePromoBtn = $('#modalRemovePromoBtn');

  // بطاقة الدفع التفاعلية
  const creditCardVisual = $('#creditCardVisual');
  const cardBrandLogo = $('#cardBrandLogo');
  const cardNumberDisplay = $('#cardNumberDisplay');
  const cardHolderDisplay = $('#cardHolderDisplay');
  const cardExpiryDisplay = $('#cardExpiryDisplay');
  const cardNumInput = $('#cardNumInput');
  const cardExpiryInput = $('#cardExpiryInput');
  const cardCvvInput = $('#cardCvvInput');

  // نافذة المعاينة السريعة (Quick View Modal)
  const quickViewModal = $('#quickViewModal');
  const closeQuickView = $('#closeQuickView');
  const qvMainImg = $('#qvMainImg');
  const qvThumbsRow = $('#qvThumbsRow');
  const qvBadge = $('#qvBadge');
  const qvCategory = $('#qvCategory');
  const qvTitle = $('#qvTitle');
  const qvRating = $('#qvRating');
  const qvReviews = $('#qvReviews');
  const qvPrice = $('#qvPrice');
  const qvOldPrice = $('#qvOldPrice');
  const qvStockTicker = $('#qvStockTicker');
  const qvDesc = $('#qvDesc');
  const qvSizeGroup = $('#qvSizeGroup');
  const qvSizesRow = $('#qvSizesRow');
  const qvColorGroup = $('#qvColorGroup');
  const qvSelectedColorName = $('#qvSelectedColorName');
  const qvColorsRow = $('#qvColorsRow');
  const qvSpecsTable = $('#qvSpecsTable');
  const qvQtyVal = $('#qvQtyVal');
  const qvQtyMinus = $('#qvQtyMinus');
  const qvQtyPlus = $('#qvQtyPlus');
  const qvAddToCartBtn = $('#qvAddToCartBtn');
  const qvBuyNowBtn = $('#qvBuyNowBtn');

  // نافذة الكوبونات
  const couponsModal = $('#couponsModal');
  const closeCouponsModal = $('#closeCouponsModal');

  // قائمة الطلبات السابقة
  const ordersListEl = $('#ordersList');
  const ordersEmpty = $('#ordersEmpty');
  const ordersDrawerBadge = $('#ordersDrawerBadge');
  const startShopFromOrders = $('#startShopFromOrders');

  // المفضلة
  const favItemsEl = $('#favItems');
  const favEmpty = $('#favEmpty');
  const favFooter = $('#favFooter');
  const favDrawerCount = $('#favDrawerCount');
  const addAllFavToCartBtn = $('#addAllFavToCartBtn');
  const exploreForFavBtn = $('#exploreForFavBtn');

  // أزرار عائمة وتنبيهات
  const fabSupportBtn = $('#fabSupportBtn');
  const scrollTopBtn = $('#scrollTopBtn');
  const toast = $('#toast');
  const toastMessage = $('#toastMessage');

  // أقسام العرض
  const heroSection = $('#heroSection');
  const categoryBanner = $('#categoryBanner');
  const catBannerTitle = $('#catBannerTitle');
  const catBannerTag = $('#catBannerTag');
  const catBannerDesc = $('#catBannerDesc');

  const categoriesSection = $('#categoriesSection');
  const popularSection = $('#popularSection');
  const offersSection = $('#offersSection');
  const popularGrid = $('#popularGrid');
  const offersGrid = $('#offersGrid');

  const filteredSection = $('#filteredSection');
  const filteredTitle = $('#filteredTitle');
  const filteredCount = $('#filteredCount');
  const subFiltersEl = $('#subFilters');
  const sortSelect = $('#sortSelect');
  const filteredGrid = $('#filteredGrid');

  const searchSection = $('#searchSection');
  const searchTitle = $('#searchTitle');
  const searchGrid = $('#searchGrid');
  const backToHomeBtn = $('#backToHomeBtn');

  /* ─── حالة التطبيق (State) ─── */
  let cart = [];
  let favorites = [];
  let orders = [];
  let currentSection = 'home';
  let currentCategory = '';
  let currentSubcategory = 'all';
  let activePromoCode = null; // { code, type, value, label }
  let selectedPaymentMethod = 'cod';
  let currentQuickViewProduct = null;
  let qvSelectedSize = null;
  let qvSelectedColor = null;
  let qvCurrentQty = 1;

  /* ═══════════════════════════════════════
     بطاقة المنتج العالمية (Enhanced Product Card)
     ═══════════════════════════════════════ */
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    const isFav = favorites.includes(product.id);
    const categoryName =
      product.category === 'clothes' ? 'ملابس وأزياء' :
      product.category === 'food' ? 'سوبرماركت' : 'أدوات منزلية';

    // شارة الخصم أو العرض
    let badgeHTML = '';
    if (product.badge) {
      badgeHTML = `<span class="product-badge">${escapeHTML(product.badge)}</span>`;
    } else if (product.oldPrice && product.oldPrice > product.price) {
      const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
      badgeHTML = `<span class="product-badge">خصم ${discountPercent}%</span>`;
    }

    // شارات الأغذية والسوبرماركت
    let etaBadgeHTML = '';
    if (product.eta) {
      etaBadgeHTML = `<span class="product-eta-badge">${escapeHTML(product.eta)}</span>`;
    }

    // معاينة المقاسات للملابس
    let sizesPreviewHTML = '';
    if (product.sizes && product.sizes.length > 0) {
      const previewSizes = product.sizes.slice(0, 4);
      sizesPreviewHTML = `
        <div class="card-sizes-preview">
          ${previewSizes.map(s => `<span class="size-mini-chip">${escapeHTML(s)}</span>`).join('')}
          ${product.sizes.length > 4 ? '<span class="size-mini-chip">+</span>' : ''}
        </div>
      `;
    }

    const ratingScore = product.rating || 4.8;
    const reviews = product.reviewsCount || 24;

    card.innerHTML = `
      <div class="product-img-wrap" data-action="quickview" data-id="${product.id}">
        <img src="${encodeURI(product.image)}" alt="" loading="lazy">
        ${badgeHTML}
        ${etaBadgeHTML}
        <span class="product-category-tag">${categoryName}</span>
        <button class="product-fav-btn ${isFav ? 'active' : ''}" data-id="${product.id}" title="${isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}" aria-label="المفضلة">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <button class="product-quickview-btn" data-id="${product.id}">
          <i class="fa-solid fa-eye"></i> معاينة سريعة
        </button>
      </div>
      <div class="product-info">
        <div class="product-rating">
          <span class="stars"><i class="fa-solid fa-star"></i></span>
          <span class="score">${ratingScore}</span>
          <span class="reviews-count">(${reviews})</span>
        </div>
        <h3 class="product-name"></h3>
        <p class="product-desc"></p>
        ${sizesPreviewHTML}
        <div class="product-footer">
          <div class="price-group">
            <span class="price">${product.price} ${STORE_CONFIG.currency}</span>
            ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ${STORE_CONFIG.currency}</span>` : ''}
          </div>
          <button class="add-to-cart-btn" data-id="${product.id}">
            <i class="fa-solid fa-cart-plus"></i>
            <span>أضف للسلة</span>
          </button>
        </div>
      </div>
    `;

    // ملء النصوص لمنع أي ثغرات XSS
    card.querySelector('.product-name').textContent = product.name;
    card.querySelector('.product-desc').textContent = product.description;

    // الصورة البديلة الآمنة
    const img = card.querySelector('.product-img-wrap img');
    img.alt = product.name;
    img.onerror = function () {
      this.src = 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23f3f4f6"><rect width="400" height="400"/><text x="200" y="210" text-anchor="middle" fill="%239ca3af" font-size="28" font-family="sans-serif">market.com</text></svg>'
      );
    };

    // أحداث الإضافة والمعاينة
    const addBtn = card.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      addToCart(product);
      addBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>تمت الإضافة</span>';
      addBtn.classList.add('added');
      setTimeout(() => {
        addBtn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> <span>أضف للسلة</span>';
        addBtn.classList.remove('added');
      }, 1400);
    });

    const favBtnCard = card.querySelector('.product-fav-btn');
    favBtnCard.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleFavorite(product.id);
    });

    const qvBtn = card.querySelector('.product-quickview-btn');
    qvBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openQuickView(product.id);
    });

    const imgWrap = card.querySelector('.product-img-wrap');
    imgWrap.addEventListener('click', function (e) {
      if (e.target.closest('.product-fav-btn')) return;
      openQuickView(product.id);
    });

    return card;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function renderProducts(grid, products) {
    grid.innerHTML = '';
    if (!products || products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon-wrap"><i class="fa-solid fa-magnifying-glass"></i></div>
          <h4>لا توجد منتجات مطابقة حالياً</h4>
          <p>جرب تغيير خيارات البحث أو تصفح الأقسام الأخرى للاطلاع على أحدث العروض</p>
        </div>
      `;
      return;
    }
    products.forEach(p => grid.appendChild(createProductCard(p)));
  }

  /* ═══════════════════════════════════════
     التنقل وتغيير الثيمات
     ═══════════════════════════════════════ */
  function applyTheme(themeName) {
    document.body.className = themeName || 'theme-home';
  }

  function showHome() {
    currentSection = 'home';
    currentCategory = '';
    applyTheme('theme-home');

    heroSection.style.display = '';
    categoryBanner.style.display = 'none';
    categoriesSection.style.display = '';
    popularSection.style.display = '';
    offersSection.style.display = '';
    filteredSection.style.display = 'none';
    searchSection.style.display = 'none';

    const popular = PRODUCTS.filter(p => p.popular);
    renderProducts(popularGrid, popular);

    const offers = PRODUCTS.filter(p => p.oldPrice !== null);
    renderProducts(offersGrid, offers);

    updateActiveNav('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showCategory(catKey) {
    currentSection = catKey;
    const mappedKey = catKey === 'homeware' ? 'home' : catKey;
    currentCategory = mappedKey;
    currentSubcategory = 'all';

    const info = CATEGORIES_DATA[catKey] || CATEGORIES_DATA[mappedKey];

    if (info) {
      applyTheme(info.themeClass);
      categoryBanner.className = `category-banner ${info.bannerClass}`;
      categoryBanner.style.display = '';
      catBannerTag.textContent = info.tag;
      catBannerTitle.textContent = info.name;
      catBannerDesc.textContent = info.desc;
    }

    heroSection.style.display = 'none';
    categoriesSection.style.display = 'none';
    popularSection.style.display = 'none';
    offersSection.style.display = 'none';
    searchSection.style.display = 'none';
    filteredSection.style.display = '';

    filteredTitle.textContent = info ? info.name : catKey;

    buildSubFilters(catKey);
    filterAndRender();
    updateActiveNav(catKey);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function buildSubFilters(catKey) {
    subFiltersEl.innerHTML = '';
    const lookupKey = catKey === 'homeware' ? 'home' : catKey;
    const subs = SUBCATEGORY_LABELS[lookupKey] || [];

    subs.forEach(sub => {
      const btn = document.createElement('button');
      btn.className = `filter-chip ${sub.key === 'all' ? 'active' : ''}`;
      btn.textContent = sub.label;
      btn.setAttribute('data-sub', sub.key);
      btn.addEventListener('click', function () {
        currentSubcategory = sub.key;
        $$('#subFilters .filter-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        filterAndRender();
      });
      subFiltersEl.appendChild(btn);
    });
  }

  function filterAndRender() {
    let items = [];

    if (currentSection === 'offers') {
      items = PRODUCTS.filter(p => p.oldPrice !== null);
      if (currentSubcategory !== 'all') {
        items = items.filter(p => p.category === currentSubcategory);
      }
    } else {
      items = PRODUCTS.filter(p => p.category === currentCategory);
      if (currentSubcategory !== 'all') {
        if (currentSubcategory === 'offers') {
          items = items.filter(p => p.oldPrice !== null);
        } else {
          items = items.filter(p => p.subcategory === currentSubcategory);
        }
      }
    }

    const sortVal = sortSelect.value;
    if (sortVal === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating') {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      items.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    filteredCount.textContent = `${items.length} منتج`;
    renderProducts(filteredGrid, items);
  }

  function performSearch(query) {
    query = (query || '').trim();
    if (!query) {
      clearSearchBtn.style.display = 'none';
      if (currentSection === 'home') {
        showHome();
      } else {
        showCategory(currentSection);
      }
      return;
    }

    clearSearchBtn.style.display = 'flex';
    const lower = query.toLowerCase();

    const results = PRODUCTS.filter(p => {
      const catText = p.category === 'clothes' ? 'ملابس أزياء جاكيت فستان تيشيرت بنطلون' :
                      p.category === 'food' ? 'أغذية منتجات غذائية أرز زيت عسل تونة عصير تموين بقالة' :
                      'أدوات منزلية مطبخ خلاط حلل سكاكين شمعة منظم مكنسة ديكور';
      return p.name.toLowerCase().includes(lower) ||
             p.description.toLowerCase().includes(lower) ||
             catText.toLowerCase().includes(lower);
    });

    heroSection.style.display = 'none';
    categoryBanner.style.display = 'none';
    categoriesSection.style.display = 'none';
    popularSection.style.display = 'none';
    offersSection.style.display = 'none';
    filteredSection.style.display = 'none';
    searchSection.style.display = '';

    searchTitle.textContent = `نتائج البحث عن "${query}" (${results.length} منتج)`;
    renderProducts(searchGrid, results);
    updateActiveNav('');
  }

  /* ═══════════════════════════════════════
     محرك أكواد وكوبونات الخصم (Promo Code Engine)
     ═══════════════════════════════════════ */
  function applyPromoCode(codeStr) {
    if (!codeStr) {
      showToast('يرجى كتابة كود الخصم أولاً ⚠️');
      return false;
    }
    const cleanCode = codeStr.trim().toUpperCase();
    const promo = PROMO_CODES[cleanCode];

    if (!promo) {
      showToast(`عذراً، كود الخصم "${cleanCode}" غير صالح أو منتهي الصلاحية ❌`);
      return false;
    }

    const subtotal = getCartSubtotal();
    if (subtotal < promo.minTotal) {
      showToast(`هذا الكود يتطلب حداً أدنى للطلب بقيمة ${promo.minTotal} ${STORE_CONFIG.currency} ⚠️`);
      return false;
    }

    activePromoCode = {
      code: cleanCode,
      ...promo
    };

    updatePromoUI();
    updateCartUI();
    updateCheckoutCalculations();
    showToast(`تم تطبيق كود الخصم "${cleanCode}" بنجاح! 🎉`);
    return true;
  }

  function removePromoCode() {
    activePromoCode = null;
    updatePromoUI();
    updateCartUI();
    updateCheckoutCalculations();
    showToast('تم إلغاء كود الخصم');
  }

  function calculateDiscount(subtotal) {
    if (!activePromoCode) return 0;
    if (activePromoCode.type === 'percent') {
      return Math.round(subtotal * (activePromoCode.value / 100));
    }
    if (activePromoCode.type === 'fixed') {
      return Math.min(activePromoCode.value, subtotal);
    }
    return 0; // shipping discount is calculated separately
  }

  function calculateShipping(subtotal) {
    if (activePromoCode && activePromoCode.type === 'shipping') return 0;
    if (subtotal >= STORE_CONFIG.freeShippingThreshold) return 0;
    return STORE_CONFIG.standardShippingFee;
  }

  function updatePromoUI() {
    if (activePromoCode) {
      appliedPromoTag.style.display = 'flex';
      promoCodeName.textContent = `${activePromoCode.code} (${activePromoCode.label})`;
      cartPromoInput.value = '';

      modalAppliedPromoTag.style.display = 'flex';
      modalPromoCodeName.textContent = `${activePromoCode.code} (${activePromoCode.label})`;
      modalPromoInput.value = '';
    } else {
      appliedPromoTag.style.display = 'none';
      modalAppliedPromoTag.style.display = 'none';
    }
  }

  /* ═══════════════════════════════════════
     سلة المشتريات والحسابات
     ═══════════════════════════════════════ */
  function loadCart() {
    try {
      const saved = localStorage.getItem('market_cart');
      cart = saved ? JSON.parse(saved) : [];
    } catch (e) {
      cart = [];
    }
  }

  function saveCart() {
    localStorage.setItem('market_cart', JSON.stringify(cart));
  }

  function addToCart(product, options = {}) {
    const size = options.size || (product.sizes ? product.sizes[0] : null);
    const color = options.color || (product.colors ? product.colors[0].name : null);
    const qtyToAdd = options.qty || 1;

    // البحث عن مطابقة تامة للصنف والمقاس واللون
    const existing = cart.find(item =>
      item.id === product.id &&
      item.selectedSize === size &&
      item.selectedColor === color
    );

    if (existing) {
      existing.qty += qtyToAdd;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qtyToAdd,
        selectedSize: size,
        selectedColor: color
      });
    }

    saveCart();
    updateCartUI();
    showToast(`تمت إضافة "${product.name}" إلى السلة 🛍️`);
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
  }

  function updateQtyByIndex(index, delta) {
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      removeFromCart(index);
      return;
    }
    saveCart();
    updateCartUI();
  }

  function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;
    cartDrawerCount.textContent = `${totalItems} منتج`;

    if (totalItems > 0) {
      cartCount.classList.add('show');
    } else {
      cartCount.classList.remove('show');
    }

    renderCartItems();
  }

  function renderCartItems() {
    const oldItems = cartItemsEl.querySelectorAll('.cart-item');
    oldItems.forEach(el => el.remove());

    if (cart.length === 0) {
      cartEmpty.style.display = '';
      cartFooter.style.display = 'none';
      return;
    }

    cartEmpty.style.display = 'none';
    cartFooter.style.display = '';

    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';

      let variantText = '';
      if (item.selectedSize || item.selectedColor) {
        const parts = [];
        if (item.selectedSize) parts.push(`المقاس: ${item.selectedSize}`);
        if (item.selectedColor) parts.push(`اللون: ${item.selectedColor}`);
        variantText = `<small style="display:block; color:var(--clr-text-muted); font-size:0.75rem;">${parts.join(' · ')}</small>`;
      }

      div.innerHTML = `
        <img class="cart-item-img" src="${encodeURI(item.image)}" alt="">
        <div class="cart-item-info">
          <h4 class="ci-name"></h4>
          ${variantText}
          <div class="ci-price">${item.price * item.qty} ${STORE_CONFIG.currency}</div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button class="qty-btn minus-btn" aria-label="تقليل"><i class="fa-solid fa-minus"></i></button>
              <span class="ci-qty">${item.qty}</span>
              <button class="qty-btn plus-btn" aria-label="زيادة"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button class="remove-btn remove-cart-btn">
              <i class="fa-solid fa-trash-can"></i> حذف
            </button>
          </div>
        </div>
      `;

      div.querySelector('.ci-name').textContent = item.name;

      div.querySelector('.minus-btn').addEventListener('click', () => updateQtyByIndex(index, -1));
      div.querySelector('.plus-btn').addEventListener('click', () => updateQtyByIndex(index, 1));
      div.querySelector('.remove-cart-btn').addEventListener('click', () => removeFromCart(index));

      cartItemsEl.appendChild(div);
    });

    const subtotal = getCartSubtotal();
    const discount = calculateDiscount(subtotal);
    const shipping = calculateShipping(subtotal);
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    cartSubtotalEl.textContent = `${subtotal} ${STORE_CONFIG.currency}`;
    if (discount > 0) {
      cartDiscountRow.style.display = 'flex';
      cartDiscountAmount.textContent = `- ${discount} ${STORE_CONFIG.currency}`;
    } else {
      cartDiscountRow.style.display = 'none';
    }

    if (shipping === 0) {
      cartShippingAmount.innerHTML = '<i class="fa-solid fa-truck-fast"></i> مجاني';
      cartShippingAmount.className = 'text-success';
    } else {
      cartShippingAmount.textContent = `${shipping} ${STORE_CONFIG.currency}`;
      cartShippingAmount.className = '';
    }

    cartTotalEl.textContent = `${finalTotal} ${STORE_CONFIG.currency}`;
  }

  /* ═══════════════════════════════════════
     واجهة إتمام الطلب المخصصة (Dedicated Checkout Modal)
     ═══════════════════════════════════════ */
  function openCheckoutModal() {
    if (cart.length === 0) {
      showToast('سلة المشتريات فارغة حالياً ⚠️');
      return;
    }

    closeAllDrawers();
    loadSavedUserProfile();
    populateCheckoutOrderSummary();
    updateCheckoutCalculations();
    checkoutModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    checkoutModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function populateCheckoutOrderSummary() {
    modalCartItemsList.innerHTML = '';
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'modal-cart-item';
      
      let variant = '';
      if (item.selectedSize || item.selectedColor) {
        const parts = [];
        if (item.selectedSize) parts.push(item.selectedSize);
        if (item.selectedColor) parts.push(item.selectedColor);
        variant = ` (${parts.join(', ')})`;
      }

      row.innerHTML = `
        <img src="${encodeURI(item.image)}" alt="">
        <div class="modal-cart-item-title">
          <span class="m-title"></span>
          <div class="modal-cart-item-qty">الكمية: ${item.qty} × ${item.price} ${STORE_CONFIG.currency}</div>
        </div>
        <div class="modal-cart-item-price">${item.qty * item.price} ${STORE_CONFIG.currency}</div>
      `;

      row.querySelector('.m-title').textContent = item.name + variant;
      modalCartItemsList.appendChild(row);
    });
  }

  function updateCheckoutCalculations() {
    const subtotal = getCartSubtotal();
    const discount = calculateDiscount(subtotal);
    const shipping = calculateShipping(subtotal);
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    modalSubtotal.textContent = `${subtotal} ${STORE_CONFIG.currency}`;
    if (discount > 0) {
      modalDiscountRow.style.display = 'flex';
      modalDiscountAmount.textContent = `- ${discount} ${STORE_CONFIG.currency}`;
    } else {
      modalDiscountRow.style.display = 'none';
    }

    if (shipping === 0) {
      modalShippingAmount.innerHTML = '<i class="fa-solid fa-truck-fast"></i> مجاني';
      modalShippingAmount.className = 'text-success';
    } else {
      modalShippingAmount.textContent = `${shipping} ${STORE_CONFIG.currency}`;
      modalShippingAmount.className = '';
    }

    modalGrandTotal.textContent = `${finalTotal} ${STORE_CONFIG.currency}`;
  }

  function setupModalPaymentTabs() {
    const options = $$('.payment-card-option');
    const walletBlock = $('#modalWalletDetails');
    const instapayBlock = $('#modalInstapayDetails');
    const cardBlock = $('#modalCardDetails');

    function selectMethod(method) {
      selectedPaymentMethod = method;
      options.forEach(opt => {
        const isCurrent = opt.getAttribute('data-method') === method;
        opt.classList.toggle('active', isCurrent);
        const radio = opt.querySelector('input');
        if (radio) radio.checked = isCurrent;
      });

      walletBlock.style.display = method === 'wallet' ? 'block' : 'none';
      instapayBlock.style.display = method === 'instapay' ? 'block' : 'none';
      cardBlock.style.display = method === 'card' ? 'block' : 'none';
    }

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        selectMethod(opt.getAttribute('data-method'));
      });
    });

    // محاكي البطاقة الائتمانية التفاعلي
    cardNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
      e.target.value = formatted;

      cardNumberDisplay.textContent = formatted || '•••• •••• •••• ••••';

      // كشف نوع البطاقة تلقائياً
      if (val.startsWith('4')) {
        cardBrandLogo.innerHTML = '<i class="fa-brands fa-cc-visa"></i>';
      } else if (val.startsWith('5')) {
        cardBrandLogo.innerHTML = '<i class="fa-brands fa-cc-mastercard"></i>';
      } else if (val.startsWith('5078') || val.startsWith('6')) {
        cardBrandLogo.innerHTML = '<i class="fa-solid fa-shield"></i> ميزة';
      } else {
        cardBrandLogo.innerHTML = '<i class="fa-solid fa-credit-card"></i>';
      }
    });

    cardExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2);
      }
      e.target.value = val;
      cardExpiryDisplay.textContent = val || 'MM/YY';
    });

    modalCustName.addEventListener('input', (e) => {
      const name = e.target.value.trim().toUpperCase();
      cardHolderDisplay.textContent = name || 'CARD HOLDER';
    });
  }

  function loadSavedUserProfile() {
    try {
      const saved = localStorage.getItem('market_user_profile');
      if (saved) {
        const profile = JSON.parse(saved);
        if (profile.name) modalCustName.value = profile.name;
        if (profile.phone) modalCustPhone.value = profile.phone;
        if (profile.address) modalCustAddress.value = profile.address;
        cardHolderDisplay.textContent = profile.name ? profile.name.toUpperCase() : 'CARD HOLDER';
      }
    } catch (e) {}
  }

  function saveUserProfile(name, phone, address) {
    if (!saveAddressCheckbox.checked) return;
    try {
      localStorage.setItem('market_user_profile', JSON.stringify({ name, phone, address }));
    } catch (e) {}
  }

  /* ═══════════════════════════════════════
     تأكيد الطلب وتخزينه في سجل الطلبات وإرسال واتساب
     ═══════════════════════════════════════ */
  function submitOrderFromModal() {
    let valid = true;
    const name = modalCustName.value.trim();
    const phone = modalCustPhone.value.trim();
    const address = modalCustAddress.value.trim();
    const notes = modalCustNotes.value.trim();

    if (name.length < 3) {
      modalCustName.parentElement.classList.add('has-error');
      valid = false;
    } else {
      modalCustName.parentElement.classList.remove('has-error');
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^01[0125][0-9]{8}$/.test(cleanPhone)) {
      modalCustPhone.parentElement.classList.add('has-error');
      valid = false;
    } else {
      modalCustPhone.parentElement.classList.remove('has-error');
    }

    if (address.length < 6) {
      modalCustAddress.parentElement.classList.add('has-error');
      valid = false;
    } else {
      modalCustAddress.parentElement.classList.remove('has-error');
    }

    if (!valid) {
      showToast('يرجى تصحيح أخطاء العنوان والبيانات الشخصية ⚠️');
      return;
    }

    // حفظ البروفايل
    saveUserProfile(name, phone, address);

    const subtotal = getCartSubtotal();
    const discount = calculateDiscount(subtotal);
    const shipping = calculateShipping(subtotal);
    const grandTotal = Math.max(0, subtotal - discount + shipping);

    // تفاصيل وسيلة الدفع بالرسالة
    let paymentDesc = '';
    if (selectedPaymentMethod === 'cod') {
      paymentDesc = '💵 *الدفع عند الاستلام نقداً (كاش)* بعد المعاينة';
    } else if (selectedPaymentMethod === 'wallet') {
      const senderW = $('#modalSenderWallet').value.trim();
      paymentDesc = '📱 *المحافظ الإلكترونية الذكية (فودافون/اتصالات/WE/أورنج)*';
      paymentDesc += '\n   • محفظة المتجر المحول إليها: 01143950895';
      if (senderW) paymentDesc += `\n   • رقم المحفظة المحول منها: ${senderW}`;
    } else if (selectedPaymentMethod === 'instapay') {
      const senderI = $('#modalSenderInstapay').value.trim();
      paymentDesc = '🏦 *إنستاباي / تحويل بنكي فوري*';
      paymentDesc += '\n   • معرف إنستاباي: market@instapay';
      if (senderI) paymentDesc += `\n   • اسم المحول / المرجع: ${senderI}`;
    } else if (selectedPaymentMethod === 'card') {
      paymentDesc = '💳 *بطاقة بنكية (فيزا / ماستركارد / ميزة)*';
      paymentDesc += '\n   • يرجى إرسال رابط بوابة الدفع الإلكتروني المباشر';
    }

    // توليد رقم الطلب
    const orderNumber = 'MKT-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleDateString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });

    // تجميع الفاتورة الذكية للواتساب
    let msg = `🛍️ *فاتورة طلب معتمد — متجر ${STORE_CONFIG.storeName}*\n`;
    msg += `رقم الطلب: *#${orderNumber}*\n`;
    msg += `التاريخ: ${orderDate}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `📦 *المنتجات المطلوبة (${cart.length} صنف):*\n`;
    cart.forEach((item, idx) => {
      let opt = [];
      if (item.selectedSize) opt.push(`المقاس: ${item.selectedSize}`);
      if (item.selectedColor) opt.push(`اللون: ${item.selectedColor}`);
      const optStr = opt.length ? ` (${opt.join(', ')})` : '';

      msg += `${idx + 1}. *${item.name}*${optStr}\n`;
      msg += `   الكمية: ${item.qty} × ${item.price} ${STORE_CONFIG.currency} = ${item.qty * item.price} ${STORE_CONFIG.currency}\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `المجموع الفرعي: ${subtotal} ${STORE_CONFIG.currency}\n`;

    if (discount > 0 && activePromoCode) {
      msg += `🎟️ كود الخصم (${activePromoCode.code}): -${discount} ${STORE_CONFIG.currency}\n`;
    }

    msg += `🚚 مصاريف الشحن: ${shipping === 0 ? 'مجاني ⚡' : shipping + ' ' + STORE_CONFIG.currency}\n`;
    msg += `💰 *الإجمالي النهائي المستحق: ${grandTotal} ${STORE_CONFIG.currency}*\n\n`;

    msg += `💳 *طريقة الدفع المختارة:* \n${paymentDesc}\n\n`;

    msg += `👤 *بيانات المستلم والتسليم:* \n`;
    msg += `• الاسم: ${name}\n`;
    msg += `• الهاتف: ${phone}\n`;
    msg += `• العنوان بالتفصيل: ${address}\n`;
    if (notes) msg += `• ملاحظات التوصيل: ${notes}\n`;

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `تم الطلب عبر منصة ${STORE_CONFIG.storeName} الرسمية ✅`;

    // حفظ الطلب في الـ Local Backend Simulator
    saveOrderToHistory({
      orderId: orderNumber,
      date: orderDate,
      items: [...cart],
      grandTotal: grandTotal,
      paymentMethod: selectedPaymentMethod,
      status: 'confirmed'
    });

    // فتح واتساب
    const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    showToast('تم تأكيد طلبك بنجاح وفتح محادثة واتساب الرسمية 🎉');

    // تصفير السلة وإغلاق النافذة
    cart = [];
    activePromoCode = null;
    saveCart();
    updateCartUI();
    closeCheckout();
    renderOrdersList();
  }

  /* ═══════════════════════════════════════
     سجل الطلبات وتتبع الشحنات (Orders History Simulator)
     ═══════════════════════════════════════ */
  function loadOrders() {
    try {
      const saved = localStorage.getItem('market_orders');
      orders = saved ? JSON.parse(saved) : [];
    } catch (e) {
      orders = [];
    }
  }

  function saveOrderToHistory(orderData) {
    orders.unshift(orderData);
    try {
      localStorage.setItem('market_orders', JSON.stringify(orders));
    } catch (e) {}
    updateOrdersBadge();
  }

  function updateOrdersBadge() {
    ordersCount.textContent = orders.length;
    ordersDrawerBadge.textContent = `${orders.length} طلب`;
    if (orders.length > 0) {
      ordersCount.classList.add('show');
    } else {
      ordersCount.classList.remove('show');
    }
  }

  function renderOrdersList() {
    const oldCards = ordersListEl.querySelectorAll('.order-history-card');
    oldCards.forEach(c => c.remove());

    if (orders.length === 0) {
      ordersEmpty.style.display = '';
      return;
    }

    ordersEmpty.style.display = 'none';

    orders.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-history-card';

      const itemsSummary = order.items.map(i => `${i.name} (×${i.qty})`).join('، ');

      card.innerHTML = `
        <div class="order-history-header">
          <span class="order-number">طلب رقم: #${order.orderId}</span>
          <span class="order-date">${order.date}</span>
        </div>

        <div class="order-tracking-timeline">
          <div class="timeline-track-bar"></div>
          <div class="tracking-step done">
            <span class="tracking-dot"><i class="fa-solid fa-check"></i></span>
            <span>تم التأكيد</span>
          </div>
          <div class="tracking-step done">
            <span class="tracking-dot"><i class="fa-solid fa-box"></i></span>
            <span>جاري التجهيز</span>
          </div>
          <div class="tracking-step">
            <span class="tracking-dot"><i class="fa-solid fa-truck"></i></span>
            <span>مع المندوب</span>
          </div>
          <div class="tracking-step">
            <span class="tracking-dot"><i class="fa-solid fa-house"></i></span>
            <span>تم التسليم</span>
          </div>
        </div>

        <div class="order-history-items">
          <strong>الأصناف:</strong> ${escapeHTML(itemsSummary)}
        </div>

        <div class="order-history-total">
          <span>الإجمالي: <strong class="text-primary">${order.grandTotal} ${STORE_CONFIG.currency}</strong></span>
          <button class="btn-primary-sm reorder-btn" style="padding: 6px 14px; font-size: 0.78rem;">
            <i class="fa-solid fa-rotate-right"></i> إعادة الطلب
          </button>
        </div>
      `;

      card.querySelector('.reorder-btn').addEventListener('click', () => {
        order.items.forEach(it => {
          addToCart(it, { size: it.selectedSize, color: it.selectedColor, qty: it.qty });
        });
        closeAllDrawers();
        openDrawer(cartDrawer);
        showToast('تمت إضافة عناصر الطلب السابق إلى السلة بنجاح 🔄');
      });

      ordersListEl.appendChild(card);
    });
  }

  /* ═══════════════════════════════════════
     نافذة المعاينة السريعة (Quick View Modal)
     ═══════════════════════════════════════ */
  function openQuickView(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    currentQuickViewProduct = product;
    qvCurrentQty = 1;
    qvQtyVal.textContent = '1';

    // الصور والمعرض
    qvMainImg.src = encodeURI(product.image);
    qvBadge.textContent = product.badge || (product.oldPrice ? 'عرض خاص' : '');
    qvBadge.style.display = (product.badge || product.oldPrice) ? '' : 'none';

    qvThumbsRow.innerHTML = '';
    const gallery = product.gallery && product.gallery.length ? product.gallery : [product.image];
    gallery.forEach((imgUrl, idx) => {
      const thumb = document.createElement('img');
      thumb.className = `qv-thumb ${idx === 0 ? 'active' : ''}`;
      thumb.src = encodeURI(imgUrl);
      thumb.alt = product.name;
      thumb.addEventListener('click', () => {
        qvMainImg.src = encodeURI(imgUrl);
        $$('.qv-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
      qvThumbsRow.appendChild(thumb);
    });

    qvCategory.textContent = product.category === 'clothes' ? 'ملابس وأزياء' :
                             product.category === 'food' ? 'سوبرماركت ومنتجات غذائية' : 'أدوات منزلية';
    qvTitle.textContent = product.name;
    qvRating.textContent = product.rating || 4.9;
    qvReviews.textContent = `(${product.reviewsCount || 35} مراجعة)`;
    qvPrice.textContent = `${product.price} ${STORE_CONFIG.currency}`;
    qvOldPrice.textContent = product.oldPrice ? `${product.oldPrice} ${STORE_CONFIG.currency}` : '';
    qvDesc.textContent = product.description;

    qvStockTicker.innerHTML = `<i class="fa-solid fa-fire text-danger"></i> متبقي ${product.stockLeft || 3} قطع فقط في المخزن`;

    // المقاسات (للملابس)
    if (product.sizes && product.sizes.length) {
      qvSizeGroup.style.display = '';
      qvSizesRow.innerHTML = '';
      qvSelectedSize = product.sizes[0];
      product.sizes.forEach((s, idx) => {
        const pill = document.createElement('div');
        pill.className = `size-pill ${idx === 0 ? 'active' : ''}`;
        pill.textContent = s;
        pill.addEventListener('click', () => {
          qvSelectedSize = s;
          $$('.size-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        });
        qvSizesRow.appendChild(pill);
      });
    } else {
      qvSizeGroup.style.display = 'none';
      qvSelectedSize = null;
    }

    // الألوان
    if (product.colors && product.colors.length) {
      qvColorGroup.style.display = '';
      qvColorsRow.innerHTML = '';
      qvSelectedColor = product.colors[0].name;
      qvSelectedColorName.textContent = qvSelectedColor;

      product.colors.forEach((c, idx) => {
        const swatch = document.createElement('div');
        swatch.className = `color-swatch ${idx === 0 ? 'active' : ''}`;
        swatch.style.backgroundColor = c.hex;
        swatch.title = c.name;
        swatch.addEventListener('click', () => {
          qvSelectedColor = c.name;
          qvSelectedColorName.textContent = c.name;
          $$('.color-swatch').forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
        });
        qvColorsRow.appendChild(swatch);
      });
    } else {
      qvColorGroup.style.display = 'none';
      qvSelectedColor = null;
    }

    // جدول المواصفات
    qvSpecsTable.innerHTML = '';
    if (product.specs) {
      Object.entries(product.specs).forEach(([k, v]) => {
        const line = document.createElement('div');
        line.className = 'spec-line';
        line.innerHTML = `<strong>${escapeHTML(k)}:</strong> <span>${escapeHTML(v)}</span>`;
        qvSpecsTable.appendChild(line);
      });
      qvSpecsTable.style.display = '';
    } else {
      qvSpecsTable.style.display = 'none';
    }

    quickViewModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickViewModal() {
    quickViewModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ═══════════════════════════════════════
     نظام قائمة المفضلة
     ═══════════════════════════════════════ */
  function loadFavorites() {
    try {
      const saved = localStorage.getItem('market_favorites');
      favorites = saved ? JSON.parse(saved) : [];
    } catch (e) {
      favorites = [];
    }
  }

  function saveFavorites() {
    localStorage.setItem('market_favorites', JSON.stringify(favorites));
  }

  function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    const prod = PRODUCTS.find(p => p.id === productId);

    if (index > -1) {
      favorites.splice(index, 1);
      showToast(`تمت إزالة "${prod ? prod.name : ''}" من المفضلة`);
    } else {
      favorites.push(productId);
      showToast(`تمت إضافة "${prod ? prod.name : ''}" إلى المفضلة ❤️`);
    }

    saveFavorites();
    updateFavoritesUI();
    syncHeartIcons();
  }

  function syncHeartIcons() {
    $$('.product-fav-btn').forEach(btn => {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const isFav = favorites.includes(id);
      btn.classList.toggle('active', isFav);
      btn.querySelector('i').className = isFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      btn.title = isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة';
    });
  }

  function updateFavoritesUI() {
    favCount.textContent = favorites.length;
    favDrawerCount.textContent = `${favorites.length} منتج`;

    if (favorites.length > 0) {
      favCount.classList.add('show');
    } else {
      favCount.classList.remove('show');
    }

    renderFavoriteItems();
  }

  function renderFavoriteItems() {
    const oldItems = favItemsEl.querySelectorAll('.fav-item');
    oldItems.forEach(el => el.remove());

    if (favorites.length === 0) {
      favEmpty.style.display = '';
      favFooter.style.display = 'none';
      return;
    }

    favEmpty.style.display = 'none';
    favFooter.style.display = '';

    favorites.forEach(id => {
      const item = PRODUCTS.find(p => p.id === id);
      if (!item) return;

      const div = document.createElement('div');
      div.className = 'fav-item';
      div.innerHTML = `
        <img class="fav-item-img" src="${encodeURI(item.image)}" alt="">
        <div class="fav-item-info">
          <h4 class="fi-name"></h4>
          <div class="fi-price">${item.price} ${STORE_CONFIG.currency}</div>
          <div class="cart-item-actions">
            <button class="add-to-cart-btn btn-sm-fav" data-id="${item.id}">
              <i class="fa-solid fa-cart-plus"></i> أضف للسلة
            </button>
            <button class="remove-btn remove-fav-btn" data-id="${item.id}">
              <i class="fa-solid fa-trash-can"></i> حذف
            </button>
          </div>
        </div>
      `;

      div.querySelector('.fi-name').textContent = item.name;

      div.querySelector('.btn-sm-fav').addEventListener('click', () => {
        addToCart(item);
      });

      div.querySelector('.remove-fav-btn').addEventListener('click', () => {
        toggleFavorite(item.id);
      });

      favItemsEl.appendChild(div);
    });
  }

  function addAllFavoritesToCart() {
    if (favorites.length === 0) return;
    favorites.forEach(id => {
      const prod = PRODUCTS.find(p => p.id === id);
      if (prod) {
        addToCart(prod);
      }
    });

    closeAllDrawers();
    openDrawer(cartDrawer);
    showToast('تم نقل جميع عناصر المفضلة إلى السلة 🛍️');
  }

  /* ═══════════════════════════════════════
     إدارة الأدراج الجانبية والنوافذ
     ═══════════════════════════════════════ */
  function openDrawer(drawerEl) {
    closeAllDrawers();
    drawerOverlay.classList.add('open');
    drawerEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeAllDrawers() {
    drawerOverlay.classList.remove('open');
    [cartDrawer, favDrawer, supportDrawer, ordersDrawer].forEach(d => d.classList.remove('open'));
    document.body.style.overflow = '';
  }

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function updateActiveNav(sectionKey) {
    $$('.nav-btn').forEach(btn => {
      const match = btn.getAttribute('data-section') === sectionKey;
      btn.classList.toggle('active', match);
    });
  }

  /* ═══════════════════════════════════════
     ربط الأحداث الشامل (Event Binding)
     ═══════════════════════════════════════ */
  function bindEvents() {
    // اللوجو للرئيسية
    logoHome.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      showHome();
    });

    // التنقل في الأقسام
    $$('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        const section = btn.getAttribute('data-section');
        if (section === 'home') {
          showHome();
        } else {
          showCategory(section);
        }
      });
    });

    // كروت الأقسام الكبرى
    $$('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        const nav = card.getAttribute('data-nav');
        showCategory(nav);
      });
    });

    // روابط الفوتر
    $$('[data-footer-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showCategory(link.getAttribute('data-footer-nav'));
      });
    });

    const viewAllOffersBtn = $('[data-nav="offers"]');
    if (viewAllOffersBtn) {
      viewAllOffersBtn.addEventListener('click', () => showCategory('offers'));
    }

    // البحث الفوري
    let searchDebounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        performSearch(searchInput.value);
      }, 250);
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      performSearch('');
    });

    backToHomeBtn.addEventListener('click', () => {
      searchInput.value = '';
      performSearch('');
    });

    sortSelect.addEventListener('change', () => filterAndRender());

    // فتح وإغلاق الأدراج
    cartBtn.addEventListener('click', () => openDrawer(cartDrawer));
    cartClose.addEventListener('click', closeAllDrawers);

    favBtn.addEventListener('click', () => openDrawer(favDrawer));
    favClose.addEventListener('click', closeAllDrawers);

    supportBtn.addEventListener('click', () => openDrawer(supportDrawer));
    supportClose.addEventListener('click', closeAllDrawers);
    fabSupportBtn.addEventListener('click', () => openDrawer(supportDrawer));

    trackOrdersBtn.addEventListener('click', () => {
      renderOrdersList();
      openDrawer(ordersDrawer);
    });
    ordersClose.addEventListener('click', closeAllDrawers);

    const footerTrack = $('#footerTrackOrders');
    if (footerTrack) {
      footerTrack.addEventListener('click', (e) => {
        e.preventDefault();
        renderOrdersList();
        openDrawer(ordersDrawer);
      });
    }

    const footerSupport = $('#footerSupportLink');
    if (footerSupport) {
      footerSupport.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer(supportDrawer);
      });
    }

    drawerOverlay.addEventListener('click', closeAllDrawers);

    // كود الخصم في السلة
    cartApplyPromoBtn.addEventListener('click', () => {
      applyPromoCode(cartPromoInput.value);
    });

    cartPromoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPromoCode(cartPromoInput.value);
      }
    });

    removePromoBtn.addEventListener('click', removePromoCode);

    // كود الخصم في صفحة الـ Checkout Modal
    modalApplyPromoBtn.addEventListener('click', () => {
      applyPromoCode(modalPromoInput.value);
    });

    modalPromoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPromoCode(modalPromoInput.value);
      }
    });

    modalRemovePromoBtn.addEventListener('click', removePromoCode);

    // نافذة الكوبونات
    openCouponsBtn.addEventListener('click', () => {
      couponsModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const footerCoupons = $('#footerCouponsLink');
    if (footerCoupons) {
      footerCoupons.addEventListener('click', (e) => {
        e.preventDefault();
        couponsModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }

    viewCouponsFromCart.addEventListener('click', () => {
      couponsModal.classList.add('open');
    });

    closeCouponsModal.addEventListener('click', () => {
      couponsModal.classList.remove('open');
      if (!checkoutModal.classList.contains('open') && !cartDrawer.classList.contains('open')) {
        document.body.style.overflow = '';
      }
    });

    // تفعيل الكوبون من التذاكر
    $$('.btn-apply-ticket').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        applyPromoCode(code);
        couponsModal.classList.remove('open');
      });
    });

    const promoTicker = $('#promoTicker');
    if (promoTicker) {
      promoTicker.addEventListener('click', () => {
        applyPromoCode('WELCOME10');
      });
    }

    // فتح واجهة إتمام الطلب المخصصة (Dedicated Checkout Modal)
    proceedBtn.addEventListener('click', openCheckoutModal);
    closeCheckoutModal.addEventListener('click', closeCheckout);
    confirmCheckoutBtn.addEventListener('click', submitOrderFromModal);

    // أحداث المعاينة السريعة
    closeQuickView.addEventListener('click', closeQuickViewModal);
    qvQtyMinus.addEventListener('click', () => {
      if (qvCurrentQty > 1) {
        qvCurrentQty--;
        qvQtyVal.textContent = qvCurrentQty;
      }
    });
    qvQtyPlus.addEventListener('click', () => {
      qvCurrentQty++;
      qvQtyVal.textContent = qvCurrentQty;
    });

    qvAddToCartBtn.addEventListener('click', () => {
      if (currentQuickViewProduct) {
        addToCart(currentQuickViewProduct, {
          size: qvSelectedSize,
          color: qvSelectedColor,
          qty: qvCurrentQty
        });
        closeQuickViewModal();
      }
    });

    qvBuyNowBtn.addEventListener('click', () => {
      if (currentQuickViewProduct) {
        addToCart(currentQuickViewProduct, {
          size: qvSelectedSize,
          color: qvSelectedColor,
          qty: qvCurrentQty
        });
        closeQuickViewModal();
        openCheckoutModal();
      }
    });

    const sizeGuideBtn = $('#openSizeGuideBtn');
    if (sizeGuideBtn) {
      sizeGuideBtn.addEventListener('click', () => {
        showToast('دليل المقاسات: S (صدر 96سم)، M (صدر 102سم)، L (صدر 108سم)، XL (صدر 114سم)، XXL (صدر 120سم)');
      });
    }

    // نسخ الحسابات والمحافظ
    $$('.btn-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = btn.getAttribute('data-copy');
        if (textToCopy && navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';
            showToast('تم نسخ الرقم للحافظة بنجاح ✅');
            setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
          });
        }
      });
    });

    startShoppingBtn.addEventListener('click', () => {
      closeAllDrawers();
      showHome();
    });

    exploreForFavBtn.addEventListener('click', () => {
      closeAllDrawers();
      showHome();
    });

    startShopFromOrders.addEventListener('click', () => {
      closeAllDrawers();
      showHome();
    });

    addAllFavToCartBtn.addEventListener('click', addAllFavoritesToCart);

    // سكرول وشادو الهيدر
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // إغلاق بـ Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDrawers();
        closeCheckout();
        closeQuickViewModal();
        couponsModal.classList.remove('open');
      }
    });

    // إعداد واجهة الدفع المتعددة التفاعلية
    setupModalPaymentTabs();
  }

  /* ═══════════════════════════════════════
     التهيئة الأولى للتطبيق
     ═══════════════════════════════════════ */
  function init() {
    loadFavorites();
    loadCart();
    loadOrders();
    updateFavoritesUI();
    updateCartUI();
    updateOrdersBadge();
    showHome();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
