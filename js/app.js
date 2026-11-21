/**
 * ======================================================
 *  market.com — منطق التطبيق الرئيسي
 * ======================================================
 *  البحث الفوري · الفلترة · السلة · الطلب عبر واتساب
 *  جميع البيانات الحساسة (أسماء/عناوين) تُعرض عبر
 *  textContent لمنع هجمات XSS
 * ======================================================
 */

(function () {
  'use strict';

  /* ─── رقم واتساب لاستلام الطلبات ─── */
  const WHATSAPP_NUMBER = '201143950895';

  /* ─── خريطة أسماء الأقسام والفرعية بالعربية ─── */
  const CATEGORY_NAMES = {
    clothes: '🧥 الملابس',
    food: '🍎 المنتجات الغذائية',
    home: '🏠 الأدوات المنزلية'
  };

  const SUBCATEGORY_LABELS = {
    clothes: [
      { key: 'all', label: 'الكل' },
      { key: 'men', label: 'رجالي' },
      { key: 'women', label: 'حريمي' },
      { key: 'kids', label: 'أطفال' },
      { key: 'offers', label: 'عروض' }
    ],
    food: [
      { key: 'all', label: 'الكل' },
      { key: 'essentials', label: 'أساسيات ومواد تموينية' },
      { key: 'drinks', label: 'مشروبات' },
      { key: 'canned', label: 'معلبات' },
      { key: 'bundle-offers', label: 'عروض التوفير' }
    ],
    home: [
      { key: 'all', label: 'الكل' },
      { key: 'kitchen', label: 'أدوات مطبخ' },
      { key: 'organizers', label: 'تنظيم وترتيب' },
      { key: 'decor', label: 'ديكور' },
      { key: 'appliances', label: 'أجهزة صغيرة' }
    ]
  };

  /* ─── عناصر DOM ─── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const searchInput     = $('#searchInput');
  const cartBtn         = $('#cartBtn');
  const cartCount       = $('#cartCount');
  const cartOverlay     = $('#cartOverlay');
  const cartDrawer      = $('#cartDrawer');
  const cartClose       = $('#cartClose');
  const cartItemsEl     = $('#cartItems');
  const cartEmpty       = $('#cartEmpty');
  const cartFooter      = $('#cartFooter');
  const cartTotalEl     = $('#cartTotal');
  const proceedBtn      = $('#proceedBtn');
  const checkoutForm    = $('#checkoutForm');
  const whatsappBtn     = $('#whatsappBtn');
  const toast           = $('#toast');
  const heroSection     = $('#heroSection');
  const categoriesSection = $('#categoriesSection');
  const popularSection  = $('#popularSection');
  const offersSection   = $('#offersSection');
  const filteredSection = $('#filteredSection');
  const filteredTitle   = $('#filteredTitle');
  const subFiltersEl    = $('#subFilters');
  const sortSelect      = $('#sortSelect');
  const filteredGrid    = $('#filteredGrid');
  const searchSection   = $('#searchSection');
  const searchTitle     = $('#searchTitle');
  const searchGrid      = $('#searchGrid');
  const popularGrid     = $('#popularGrid');
  const offersGrid      = $('#offersGrid');

  /* ─── حالة التطبيق ─── */
  let cart = [];
  let currentSection = 'home';
  let currentCategory = '';
  let currentSubcategory = 'all';

  /* ═══════════════════════════════════════
     إنشاء بطاقة المنتج (Product Card)
     ═══════════════════════════════════════ */
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    // شارة المنتج
    let badgeHTML = '';
    if (product.badge) {
      badgeHTML = '<span class="product-badge"></span>';
    }

    // شارة القسم
    const categoryLabel =
      product.category === 'clothes' ? 'ملابس' :
      product.category === 'food' ? 'غذائيات' : 'منزلية';

    // السعر القديم
    let oldPriceHTML = '';
    if (product.oldPrice) {
      oldPriceHTML = '<span class="old-price"></span>';
    }

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${encodeURI(product.image)}" alt="" loading="lazy">
        ${badgeHTML}
        <span class="product-category-tag"></span>
      </div>
      <div class="product-info">
        <h3 class="product-name"></h3>
        <p class="desc"></p>
        <div class="product-footer">
          <div class="price-group">
            <span class="price"></span>
            ${oldPriceHTML}
          </div>
          <button class="add-to-cart-btn" data-id="${product.id}">أضف للسلة</button>
        </div>
      </div>
    `;

    // ملء النصوص بـ textContent (حماية XSS)
    card.querySelector('.product-name').textContent = product.name;
    card.querySelector('.desc').textContent = product.description;
    card.querySelector('.price').textContent = product.price + ' ج.م';
    card.querySelector('.product-category-tag').textContent = categoryLabel;

    if (product.badge) {
      card.querySelector('.product-badge').textContent = product.badge;
    }
    if (product.oldPrice) {
      card.querySelector('.old-price').textContent = product.oldPrice + ' ج.م';
    }

    // حدث الصورة البديلة
    const img = card.querySelector('.product-img-wrap img');
    img.alt = product.name;
    img.onerror = function() {
      this.src = 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23e5e7eb"><rect width="400" height="400"/><text x="200" y="200" text-anchor="middle" fill="%239ca3af" font-size="48" font-family="sans-serif">📦</text></svg>'
      );
    };

    // زر الإضافة للسلة
    card.querySelector('.add-to-cart-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      addToCart(product);
      this.textContent = 'تمت الإضافة ✓';
      this.classList.add('added');
      setTimeout(() => {
        this.textContent = 'أضف للسلة';
        this.classList.remove('added');
      }, 1200);
    });

    return card;
  }

  /* ═══════════════════════════════════════
     عرض المنتجات في شبكة
     ═══════════════════════════════════════ */
  function renderProducts(grid, products) {
    grid.innerHTML = '';
    if (products.length === 0) {
      grid.innerHTML = '<div class="no-results"><div class="icon">😕</div><p>لا توجد منتجات مطابقة</p></div>';
      return;
    }
    products.forEach(function (p) {
      grid.appendChild(createProductCard(p));
    });
  }

  /* ═══════════════════════════════════════
     الصفحة الرئيسية
     ═══════════════════════════════════════ */
  function showHome() {
    currentSection = 'home';
    heroSection.style.display = '';
    categoriesSection.style.display = '';
    popularSection.style.display = '';
    offersSection.style.display = '';
    filteredSection.style.display = 'none';
    searchSection.style.display = 'none';

    // الأكثر طلباً
    var popular = PRODUCTS.filter(function (p) { return p.popular; });
    renderProducts(popularGrid, popular);

    // عروض اليوم (لها سعر قديم)
    var offers = PRODUCTS.filter(function (p) { return p.oldPrice !== null; });
    renderProducts(offersGrid, offers);

    updateActiveNav('home');
  }

  /* ═══════════════════════════════════════
     عرض قسم معين
     ═══════════════════════════════════════ */
  function showCategory(cat) {
    // ربط اسم القسم من الـ nav إلى key المنتجات
    var catKey = cat === 'homeware' ? 'home' : cat;
    currentSection = cat;
    currentCategory = catKey;
    currentSubcategory = 'all';

    heroSection.style.display = 'none';
    categoriesSection.style.display = 'none';
    popularSection.style.display = 'none';
    offersSection.style.display = 'none';
    searchSection.style.display = 'none';
    filteredSection.style.display = '';

    filteredTitle.textContent = CATEGORY_NAMES[catKey] || cat;

    // بناء الفلاتر الفرعية
    buildSubFilters(catKey);

    // عرض المنتجات
    filterAndRender();

    updateActiveNav(cat);
  }

  function buildSubFilters(catKey) {
    subFiltersEl.innerHTML = '';
    var subs = SUBCATEGORY_LABELS[catKey] || [];
    subs.forEach(function (sub) {
      var btn = document.createElement('button');
      btn.className = 'filter-chip' + (sub.key === 'all' ? ' active' : '');
      btn.textContent = sub.label;
      btn.setAttribute('data-sub', sub.key);
      btn.addEventListener('click', function () {
        currentSubcategory = sub.key;
        $$('#subFilters .filter-chip').forEach(function (c) { c.classList.remove('active'); });
        btn.classList.add('active');
        filterAndRender();
      });
      subFiltersEl.appendChild(btn);
    });
  }

  function filterAndRender() {
    var items = PRODUCTS.filter(function (p) { return p.category === currentCategory; });
    if (currentSubcategory !== 'all') {
      // ربط فلتر "offers" بالمنتجات التي لديها oldPrice
      if (currentSubcategory === 'offers') {
        items = items.filter(function (p) { return p.oldPrice !== null; });
      } else {
        items = items.filter(function (p) { return p.subcategory === currentSubcategory; });
      }
    }

    // الترتيب
    var sort = sortSelect.value;
    if (sort === 'price-asc') {
      items.sort(function (a, b) { return a.price - b.price; });
    } else if (sort === 'price-desc') {
      items.sort(function (a, b) { return b.price - a.price; });
    } else {
      items.sort(function (a, b) { return (b.popular ? 1 : 0) - (a.popular ? 1 : 0); });
    }

    renderProducts(filteredGrid, items);
  }

  /* ═══════════════════════════════════════
     البحث الفوري
     ═══════════════════════════════════════ */
  function performSearch(query) {
    query = query.trim();
    if (!query) {
      showHome();
      return;
    }

    var lower = query.toLowerCase();
    var results = PRODUCTS.filter(function (p) {
      var cat = p.category === 'clothes' ? 'ملابس' :
                p.category === 'food' ? 'غذائيات منتجات غذائية' : 'منزلية أدوات منزلية';
      return p.name.toLowerCase().includes(lower) ||
             p.description.toLowerCase().includes(lower) ||
             cat.includes(lower);
    });

    heroSection.style.display = 'none';
    categoriesSection.style.display = 'none';
    popularSection.style.display = 'none';
    offersSection.style.display = 'none';
    filteredSection.style.display = 'none';
    searchSection.style.display = '';

    searchTitle.textContent = '🔍 نتائج البحث عن "' + query + '" (' + results.length + ' منتج)';
    renderProducts(searchGrid, results);

    updateActiveNav('');
  }

  /* ═══════════════════════════════════════
     سلة المشتريات
     ═══════════════════════════════════════ */
  function loadCart() {
    try {
      var saved = localStorage.getItem('market_cart');
      if (saved) cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }

  function saveCart() {
    localStorage.setItem('market_cart', JSON.stringify(cart));
  }

  function addToCart(product) {
    var existing = cart.find(function (item) { return item.id === product.id; });
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
    showToast('تمت إضافة "' + product.name + '" للسلة');
  }

  function removeFromCart(productId) {
    cart = cart.filter(function (item) { return item.id !== productId; });
    saveCart();
    updateCartUI();
  }

  function updateQty(productId, delta) {
    var item = cart.find(function (item) { return item.id === productId; });
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
    return cart.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
  }

  function updateCartUI() {
    // تحديث العداد
    var totalItems = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    cartCount.textContent = totalItems;
    if (totalItems > 0) {
      cartCount.classList.add('show');
    } else {
      cartCount.classList.remove('show');
    }

    // عرض عناصر السلة
    renderCartItems();
  }

  function renderCartItems() {
    // حذف العناصر القديمة (ماعدا cart-empty)
    var oldItems = cartItemsEl.querySelectorAll('.cart-item');
    oldItems.forEach(function (el) { el.remove(); });

    if (cart.length === 0) {
      cartEmpty.style.display = '';
      cartFooter.style.display = 'none';
      checkoutForm.classList.remove('show');
      return;
    }

    cartEmpty.style.display = 'none';
    cartFooter.style.display = '';

    cart.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'cart-item';

      div.innerHTML = '<img src="" alt="">' +
        '<div class="cart-item-info">' +
          '<h4 class="ci-name"></h4>' +
          '<div class="item-price ci-price"></div>' +
          '<div class="cart-item-actions">' +
            '<button class="qty-btn minus-btn">−</button>' +
            '<span class="cart-item-qty ci-qty"></span>' +
            '<button class="qty-btn plus-btn">+</button>' +
            '<button class="remove-item">حذف</button>' +
          '</div>' +
        '</div>';

      // ملء البيانات بأمان (textContent)
      div.querySelector('img').src = encodeURI(item.image);
      div.querySelector('img').alt = item.name;
      div.querySelector('.ci-name').textContent = item.name;
      div.querySelector('.ci-price').textContent = (item.price * item.qty) + ' ج.م';
      div.querySelector('.ci-qty').textContent = item.qty;

      // صورة بديلة
      div.querySelector('img').onerror = function() {
        this.src = 'data:image/svg+xml,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="%23e5e7eb"><rect width="70" height="70"/><text x="35" y="40" text-anchor="middle" fill="%239ca3af" font-size="24">📦</text></svg>'
        );
      };

      // أحداث الأزرار
      div.querySelector('.minus-btn').addEventListener('click', function () { updateQty(item.id, -1); });
      div.querySelector('.plus-btn').addEventListener('click', function () { updateQty(item.id, 1); });
      div.querySelector('.remove-item').addEventListener('click', function () { removeFromCart(item.id); });

      cartItemsEl.appendChild(div);
    });

    cartTotalEl.textContent = getCartTotal() + ' ج.م';
  }

  /* ─── فتح/إغلاق السلة ─── */
  function openCart() {
    cartOverlay.classList.add('open');
    cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartOverlay.classList.remove('open');
    cartDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ═══════════════════════════════════════
     نموذج الطلب + إرسال واتساب
     ═══════════════════════════════════════ */
  function validateForm() {
    var valid = true;
    var name = $('#custName');
    var phone = $('#custPhone');
    var address = $('#custAddress');

    // الاسم
    if (name.value.trim().length < 2) {
      name.parentElement.classList.add('has-error');
      valid = false;
    } else {
      name.parentElement.classList.remove('has-error');
    }

    // الهاتف (11 رقم مصري)
    var phoneVal = phone.value.replace(/\D/g, '');
    if (!/^01[0-9]{9}$/.test(phoneVal)) {
      phone.parentElement.classList.add('has-error');
      valid = false;
    } else {
      phone.parentElement.classList.remove('has-error');
    }

    // العنوان
    if (address.value.trim().length < 5) {
      address.parentElement.classList.add('has-error');
      valid = false;
    } else {
      address.parentElement.classList.remove('has-error');
    }

    return valid;
  }

  function sendToWhatsApp() {
    if (!validateForm()) return;

    var name = $('#custName').value.trim();
    var phone = $('#custPhone').value.trim();
    var address = $('#custAddress').value.trim();
    var notes = $('#custNotes').value.trim();

    // بناء الرسالة المنسقة
    var msg = '🛍️ *طلب جديد من متجر market.com*\n';
    msg += '━━━━━━━━━━━━━━━\n\n';

    cart.forEach(function (item, i) {
      msg += (i + 1) + '. ' + item.name + '\n';
      msg += '   الكمية: ' + item.qty + ' × ' + item.price + ' ج.م = ' + (item.qty * item.price) + ' ج.م\n\n';
    });

    msg += '━━━━━━━━━━━━━━━\n';
    msg += '💰 *الإجمالي: ' + getCartTotal() + ' ج.م*\n';
    msg += '💳 *طريقة الدفع: عند الاستلام*\n\n';
    msg += '👤 *بيانات العميل:*\n';
    msg += '• الاسم: ' + name + '\n';
    msg += '• الهاتف: ' + phone + '\n';
    msg += '• العنوان: ' + address + '\n';
    if (notes) {
      msg += '• ملاحظات: ' + notes + '\n';
    }
    msg += '\n📍 *منطقة التوصيل: القاهرة والجيزة*\n';
    msg += '━━━━━━━━━━━━━━━\n';
    msg += 'تم الطلب عبر market.com ✅';

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener,noreferrer');

    // تنظيف بعد الإرسال
    showToast('تم فتح واتساب — أرسل الرسالة لتأكيد طلبك 🎉');
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();
    checkoutForm.classList.remove('show');

    // إعادة تعيين الحقول
    $('#custName').value = '';
    $('#custPhone').value = '';
    $('#custAddress').value = '';
    $('#custNotes').value = '';
  }

  /* ═══════════════════════════════════════
     إشعار Toast
     ═══════════════════════════════════════ */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 2500);
  }

  /* ═══════════════════════════════════════
     تحديث شريط التنقل
     ═══════════════════════════════════════ */
  function updateActiveNav(section) {
    $$('.nav-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-section') === section);
    });
  }

  /* ═══════════════════════════════════════
     ربط الأحداث
     ═══════════════════════════════════════ */
  function bindEvents() {
    // شريط التنقل
    $$('.nav-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        searchInput.value = '';
        var section = btn.getAttribute('data-section');
        if (section === 'home') {
          showHome();
        } else {
          showCategory(section);
        }
      });
    });

    // بطاقات الأقسام الكبيرة
    $$('.category-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var nav = card.getAttribute('data-nav');
        searchInput.value = '';
        showCategory(nav);
      });
    });

    // البحث الفوري
    var searchTimeout;
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function () {
        performSearch(searchInput.value);
      }, 250);
    });

    // الترتيب
    sortSelect.addEventListener('change', function () {
      filterAndRender();
    });

    // السلة
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // متابعة الطلب
    proceedBtn.addEventListener('click', function () {
      checkoutForm.classList.toggle('show');
      if (checkoutForm.classList.contains('show')) {
        proceedBtn.textContent = 'إخفاء النموذج ▲';
      } else {
        proceedBtn.textContent = 'متابعة الطلب ✏️';
      }
    });

    // إرسال عبر واتساب
    whatsappBtn.addEventListener('click', function (e) {
      e.preventDefault();
      sendToWhatsApp();
    });

    // Header shadow on scroll
    window.addEventListener('scroll', function () {
      var header = $('#header');
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // إغلاق السلة بـ Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCart();
    });
  }

  /* ═══════════════════════════════════════
     التهيئة
     ═══════════════════════════════════════ */
  function init() {
    loadCart();
    updateCartUI();
    showHome();
    bindEvents();
  }

  // بدء التطبيق
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
