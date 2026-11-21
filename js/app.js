/**
 * ======================================================
 *  market.com — Luxury eCommerce Core Application
 * ======================================================
 *  • سلة مشتريات متعددة وسائل الدفع (كاش - محافظ - إنستاباي - بطاقات)
 *  • نظام قائمة المفضلة (Wishlist) التفاعلي المحفوظ محلياً
 *  • مركز الدعم الفني والتواصل السريع والأسئلة الشائعة
 *  • خلفيات بصرية ديناميكية لكل قسم
 *  • حماية XSS صارمة لجميع المدخلات
 * ======================================================
 */

(function () {
  'use strict';

  /* ─── إعدادات وثوابت المتجر ─── */
  const STORE_CONFIG = {
    whatsappNumber: '201143950895',
    storeName: 'market.com',
    currency: 'ج.م',
    deliveryArea: 'القاهرة والجيزة'
  };

  /* ─── بيانات وعناوين الأقسام ─── */
  const CATEGORIES_DATA = {
    clothes: {
      name: 'الملابس والأزياء',
      tag: 'أناقة وجودة عالية',
      desc: 'أرقى خطوط الموضة والأزياء الرجالية والنسائية وملابس الأطفال بخامات قطنية ممتازة وتصميمات تناسب كل الأوقات.',
      themeClass: 'theme-clothes',
      bannerClass: 'banner-clothes'
    },
    food: {
      name: 'المنتجات الغذائية',
      tag: 'طازجة وصحية 100%',
      desc: 'كل ما تحتاجه مائدتك من السلع التموينية الأساسية، الزيوت النقية، المشروبات الطبيعية، والمعلبات وكراتين التوفير.',
      themeClass: 'theme-food',
      bannerClass: 'banner-food'
    },
    homeware: {
      name: 'الأدوات المنزلية',
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

  // عناصر الهيدر والبحث
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

  // الأدراج
  const drawerOverlay = $('#drawerOverlay');
  const cartDrawer = $('#cartDrawer');
  const cartClose = $('#cartClose');
  const favDrawer = $('#favDrawer');
  const favClose = $('#favClose');
  const supportDrawer = $('#supportDrawer');
  const supportClose = $('#supportClose');

  // عناصر السلة
  const cartItemsEl = $('#cartItems');
  const cartEmpty = $('#cartEmpty');
  const cartFooter = $('#cartFooter');
  const cartSubtotalEl = $('#cartSubtotal');
  const cartTotalEl = $('#cartTotal');
  const cartDrawerCount = $('#cartDrawerCount');
  const proceedBtn = $('#proceedBtn');
  const checkoutForm = $('#checkoutForm');
  const whatsappBtn = $('#whatsappBtn');
  const startShoppingBtn = $('#startShoppingBtn');

  // عناصر المفضلة
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
  let currentSection = 'home';
  let currentCategory = '';
  let currentSubcategory = 'all';
  let selectedPaymentMethod = 'cod'; // 'cod' | 'wallet' | 'instapay' | 'card'

  /* ═══════════════════════════════════════
     بطاقة المنتج العالمية (Product Card)
     ═══════════════════════════════════════ */
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    const isFav = favorites.includes(product.id);
    const categoryName =
      product.category === 'clothes' ? 'ملابس' :
      product.category === 'food' ? 'غذائيات' : 'منزلية';

    // حساب نسبة الخصم إن وجدت
    let badgeHTML = '';
    if (product.badge) {
      badgeHTML = `<span class="product-badge">${escapeHTML(product.badge)}</span>`;
    } else if (product.oldPrice && product.oldPrice > product.price) {
      const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
      badgeHTML = `<span class="product-badge">خصم ${discountPercent}%</span>`;
    }

    // تقييم النجوم
    const ratingScore = product.rating || 4.8;
    const reviews = product.reviewsCount || 24;

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${encodeURI(product.image)}" alt="" loading="lazy">
        ${badgeHTML}
        <span class="product-category-tag">${categoryName}</span>
        <button class="product-fav-btn ${isFav ? 'active' : ''}" data-id="${product.id}" title="${isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}" aria-label="المفضلة">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
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

    // زر الإضافة للسلة
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

    // زر المفضلة
    const favBtnCard = card.querySelector('.product-fav-btn');
    favBtnCard.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleFavorite(product.id);
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

  /* ═══════════════════════════════════════
     عرض المنتجات في الشبكة
     ═══════════════════════════════════════ */
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
     التنقل وتغيير الثيم والخلفيات (Theming)
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

    // الأكثر طلباً
    const popular = PRODUCTS.filter(p => p.popular);
    renderProducts(popularGrid, popular);

    // عروض اليوم
    const offers = PRODUCTS.filter(p => p.oldPrice !== null);
    renderProducts(offersGrid, offers);

    updateActiveNav('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showCategory(catKey) {
    currentSection = catKey;
    const isOffers = (catKey === 'offers');
    const mappedKey = catKey === 'homeware' ? 'home' : catKey;
    currentCategory = mappedKey;
    currentSubcategory = 'all';

    const info = CATEGORIES_DATA[catKey] || CATEGORIES_DATA[mappedKey];

    if (info) {
      applyTheme(info.themeClass);

      // إظهار البانر الخاص بالقسم
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

    // الترتيب
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

  /* ═══════════════════════════════════════
     البحث الفوري الذكي (Instant Search)
     ═══════════════════════════════════════ */
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
                      p.category === 'food' ? 'أغذية منتجات غذائية أرز زيت عسل تونة عصير تموين' :
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
     نظام قائمة المفضلة (Wishlist System)
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
        const existing = cart.find(c => c.id === prod.id);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ id: prod.id, name: prod.name, price: prod.price, image: prod.image, qty: 1 });
        }
      }
    });

    saveCart();
    updateCartUI();
    closeAllDrawers();
    openDrawer(cartDrawer);
    showToast('تمت إضافة جميع منتجات المفضلة إلى السلة بنجاح 🛍️');
  }

  /* ═══════════════════════════════════════
     نظام سلة المشتريات (Shopping Cart)
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

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
      });
    }
    saveCart();
    updateCartUI();
    showToast(`تمت إضافة "${product.name}" إلى السلة بنجاح`);
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
  }

  function updateQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCart();
    updateCartUI();
  }

  function getCartTotal() {
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
      checkoutForm.classList.remove('show');
      proceedBtn.style.display = '';
      return;
    }

    cartEmpty.style.display = 'none';
    cartFooter.style.display = '';

    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img class="cart-item-img" src="${encodeURI(item.image)}" alt="">
        <div class="cart-item-info">
          <h4 class="ci-name"></h4>
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

      div.querySelector('.minus-btn').addEventListener('click', () => updateQty(item.id, -1));
      div.querySelector('.plus-btn').addEventListener('click', () => updateQty(item.id, 1));
      div.querySelector('.remove-cart-btn').addEventListener('click', () => removeFromCart(item.id));

      cartItemsEl.appendChild(div);
    });

    const total = getCartTotal();
    cartSubtotalEl.textContent = `${total} ${STORE_CONFIG.currency}`;
    cartTotalEl.textContent = `${total} ${STORE_CONFIG.currency}`;
  }

  /* ═══════════════════════════════════════
     إدارة الأدراج الجانبية (Drawers Manager)
     ═══════════════════════════════════════ */
  function openDrawer(drawerEl) {
    closeAllDrawers();
    drawerOverlay.classList.add('open');
    drawerEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeAllDrawers() {
    drawerOverlay.classList.remove('open');
    [cartDrawer, favDrawer, supportDrawer].forEach(d => d.classList.remove('open'));
    document.body.style.overflow = '';
  }

  /* ═══════════════════════════════════════
     إدارة وسائل الدفع المتعددة (Payment Methods)
     ═══════════════════════════════════════ */
  function setupPaymentTabs() {
    const paymentOptions = $$('.payment-option');
    const walletView = $('#walletDetailView');
    const instapayView = $('#instapayDetailView');
    const cardView = $('#cardDetailView');

    function updateView(method) {
      selectedPaymentMethod = method;
      paymentOptions.forEach(opt => {
        const isCurrent = opt.getAttribute('data-method') === method;
        opt.classList.toggle('active', isCurrent);
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = isCurrent;
      });

      walletView.style.display = method === 'wallet' ? 'block' : 'none';
      instapayView.style.display = method === 'instapay' ? 'block' : 'none';
      cardView.style.display = method === 'card' ? 'block' : 'none';
    }

    paymentOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const method = opt.getAttribute('data-method');
        updateView(method);
      });
    });

    // أزرار النسخ السريعة للحساب والمحفظة
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
          }).catch(() => {
            fallbackCopyText(textToCopy);
          });
        }
      });
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('تم نسخ الرقم للحافظة بنجاح ✅');
    } catch (err) {}
    document.body.removeChild(textArea);
  }

  /* ═══════════════════════════════════════
     إتمام الطلب وتوليد رسالة الواتساب المتكاملة
     ═══════════════════════════════════════ */
  function validateCheckoutForm() {
    let isValid = true;
    const nameEl = $('#custName');
    const phoneEl = $('#custPhone');
    const addressEl = $('#custAddress');

    // الاسم
    if (nameEl.value.trim().length < 3) {
      nameEl.parentElement.classList.add('has-error');
      isValid = false;
    } else {
      nameEl.parentElement.classList.remove('has-error');
    }

    // رقم الهاتف (11 رقم مصري)
    const phoneVal = phoneEl.value.replace(/\D/g, '');
    if (!/^01[0125][0-9]{8}$/.test(phoneVal)) {
      phoneEl.parentElement.classList.add('has-error');
      isValid = false;
    } else {
      phoneEl.parentElement.classList.remove('has-error');
    }

    // العنوان
    if (addressEl.value.trim().length < 6) {
      addressEl.parentElement.classList.add('has-error');
      isValid = false;
    } else {
      addressEl.parentElement.classList.remove('has-error');
    }

    return isValid;
  }

  function submitOrderToWhatsApp() {
    if (!validateCheckoutForm()) {
      showToast('يرجى تصحيح الأخطاء واستكمال بيانات التوصيل ⚠️');
      return;
    }

    const name = $('#custName').value.trim();
    const phone = $('#custPhone').value.trim();
    const address = $('#custAddress').value.trim();
    const notes = $('#custNotes').value.trim();
    const total = getCartTotal();

    // تفاصيل وسيلة الدفع بالرسالة
    let paymentText = '';
    if (selectedPaymentMethod === 'cod') {
      paymentText = '💵 *الدفع عند الاستلام نقداً (كاش)* عند باب البيت';
    } else if (selectedPaymentMethod === 'wallet') {
      const senderW = $('#senderWallet').value.trim();
      paymentText = '📱 *المحافظ الإلكترونية الذكية* (فودافون/أورنج/اتصالات/WE)';
      paymentText += '\n   • رقم محفظة المتجر: 01143950895';
      if (senderW) paymentText += `\n   • رقم المحفظة المحول منها: ${senderW}`;
    } else if (selectedPaymentMethod === 'instapay') {
      const senderI = $('#senderInstapay').value.trim();
      paymentText = '🏦 *إنستاباي / تحويل بنكي فوري*';
      paymentText += '\n   • معرّف إنستاباي: market@instapay';
      if (senderI) paymentText += `\n   • اسم المحول / المرجع: ${senderI}`;
    } else if (selectedPaymentMethod === 'card') {
      paymentText = '💳 *البطاقات البنكية (فيزا / ماستركارد / ميزة)*';
      paymentText += '\n   • برجاء إرسال رابط الدفع الإلكتروني المباشر';
    }

    // تاريخ ورقم الطلب العشوائي للمتابعة
    const orderNumber = 'MKT-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleDateString('ar-EG', { dateStyle: 'medium' });

    // تجميع الفاتورة
    let msg = `🛍️ *فاتورة طلب جديد — متجر ${STORE_CONFIG.storeName}*\n`;
    msg += `رقم الطلب: #${orderNumber} | التاريخ: ${dateStr}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `📦 *تفاصيل المنتجات المطلوبة (${cart.length} أصناف):*\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}*\n`;
      msg += `   الكمية: ${item.qty} × ${item.price} ${STORE_CONFIG.currency} = ${item.qty * item.price} ${STORE_CONFIG.currency}\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *الإجمالي المستحق: ${total} ${STORE_CONFIG.currency}*\n`;
    msg += `🚚 *التوصيل:* القاهرة والجيزة (شحن سريع)\n`;
    msg += `💳 *طريقة الدفع:* \n${paymentText}\n\n`;

    msg += `👤 *بيانات العميل والتوصيل:*\n`;
    msg += `• الاسم: ${name}\n`;
    msg += `• رقم الهاتف: ${phone}\n`;
    msg += `• العنوان بالتفصيل: ${address}\n`;
    if (notes) {
      msg += `• ملاحظات التوصيل: ${notes}\n`;
    }

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `تم الطلب بنجاح عبر موقع ${STORE_CONFIG.storeName} ✅`;

    const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // تنظيف السلة وتحديث الواجهة
    showToast('تم فتح محادثة واتساب لإتمام طلبك! 🎉');
    cart = [];
    saveCart();
    updateCartUI();
    closeAllDrawers();

    // تصفير الحقول
    $('#custName').value = '';
    $('#custPhone').value = '';
    $('#custAddress').value = '';
    $('#custNotes').value = '';
    $('#senderWallet').value = '';
    $('#senderInstapay').value = '';
    proceedBtn.style.display = '';
    checkoutForm.classList.remove('show');
  }

  /* ═══════════════════════════════════════
     إشعار Toast التفاعلي
     ═══════════════════════════════════════ */
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  /* ═══════════════════════════════════════
     تحديث شريط الأقسام (Active State)
     ═══════════════════════════════════════ */
  function updateActiveNav(sectionKey) {
    $$('.nav-btn').forEach(btn => {
      const match = btn.getAttribute('data-section') === sectionKey;
      btn.classList.toggle('active', match);
    });
  }

  /* ═══════════════════════════════════════
     ربط جميع الأحداث (Event Listeners)
     ═══════════════════════════════════════ */
  function bindEvents() {
    // اللوجو للرئيسية
    logoHome.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      showHome();
    });

    // أزرار شريط التنقل
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

    // بطاقات الأقسام المصورة
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
        const cat = link.getAttribute('data-footer-nav');
        showCategory(cat);
      });
    });

    // رابط العروض في قسم اليوم
    const viewAllOffersBtn = $('[data-nav="offers"]');
    if (viewAllOffersBtn) {
      viewAllOffersBtn.addEventListener('click', () => showCategory('offers'));
    }

    // البحث الفوري الذكي
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

    // ترتيب المنتجات
    sortSelect.addEventListener('change', () => filterAndRender());

    // فتح الأدراج الجانبية
    cartBtn.addEventListener('click', () => openDrawer(cartDrawer));
    favBtn.addEventListener('click', () => openDrawer(favDrawer));
    supportBtn.addEventListener('click', () => openDrawer(supportDrawer));
    fabSupportBtn.addEventListener('click', () => openDrawer(supportDrawer));

    const footerSupport = $('#footerSupportLink');
    if (footerSupport) footerSupport.addEventListener('click', (e) => { e.preventDefault(); openDrawer(supportDrawer); });

    const footerFav = $('#footerFavLink');
    if (footerFav) footerFav.addEventListener('click', (e) => { e.preventDefault(); openDrawer(favDrawer); });

    // إغلاق الأدراج
    cartClose.addEventListener('click', closeAllDrawers);
    favClose.addEventListener('click', closeAllDrawers);
    supportClose.addEventListener('click', closeAllDrawers);
    drawerOverlay.addEventListener('click', closeAllDrawers);

    // أزرار الحالات الفارغة
    startShoppingBtn.addEventListener('click', () => {
      closeAllDrawers();
      showHome();
    });

    exploreForFavBtn.addEventListener('click', () => {
      closeAllDrawers();
      showHome();
    });

    // إضافة جميع المفضلة للسلة
    addAllFavToCartBtn.addEventListener('click', addAllFavoritesToCart);

    // متابعة الطلب في السلة
    proceedBtn.addEventListener('click', () => {
      checkoutForm.classList.add('show');
      proceedBtn.style.display = 'none';
      setTimeout(() => {
        checkoutForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });

    // تأكيد الطلب وإرساله لواتساب
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      submitOrderToWhatsApp();
    });

    // زر العودة للأعلى وظلال الهيدر
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

    // إغلاق الأدراج بزر Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllDrawers();
    });

    // تجهيز خيارات الدفع المتعددة
    setupPaymentTabs();
  }

  /* ═══════════════════════════════════════
     التهيئة الأولى للتطبيق (Initialization)
     ═══════════════════════════════════════ */
  function init() {
    loadFavorites();
    loadCart();
    updateFavoritesUI();
    updateCartUI();
    showHome();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
