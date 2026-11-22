/**
 * Market.com - Admin Dashboard Logic
 * Handles Authentication, Real-time Orders, Status Filters, Metrics, and Invoicing
 */

(function () {
    'use strict';

    // State
    let authToken = localStorage.getItem('market_admin_token') || sessionStorage.getItem('market_admin_token') || null;
    let currentOrders = [];
    let activeFilterStatus = 'all';
    let activeGatewayFilter = '';
    let searchQuery = '';
    let autoRefreshTimer = null;
    let isAutoRefreshActive = true;
    let currentSelectedOrder = null;

    // DOM Elements - Login
    const loginSection = document.getElementById('loginSection');
    const loginForm = document.getElementById('loginForm');
    const adminUsernameInput = document.getElementById('adminUsername');
    const adminPasswordInput = document.getElementById('adminPassword');
    const btnTogglePass = document.getElementById('btnTogglePass');
    const loginAlert = document.getElementById('loginAlert');
    const btnLoginSubmit = document.getElementById('btnLoginSubmit');

    // DOM Elements - Dashboard
    const dashboardSection = document.getElementById('dashboardSection');
    const displayAdminName = document.getElementById('displayAdminName');
    const btnLogout = document.getElementById('btnLogout');
    const btnAutoRefresh = document.getElementById('btnAutoRefresh');
    const btnManualRefresh = document.getElementById('btnManualRefresh');
    const orderSearchInput = document.getElementById('orderSearchInput');
    const gatewayFilter = document.getElementById('gatewayFilter');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const emptyOrdersState = document.getElementById('emptyOrdersState');
    const btnExportCsv = document.getElementById('btnExportCsv');

    // KPIs
    const kpiRevenue = document.getElementById('kpiRevenue');
    const kpiPaidOrders = document.getElementById('kpiPaidOrders');
    const kpiPendingOrders = document.getElementById('kpiPendingOrders');
    const kpiAvgValue = document.getElementById('kpiAvgValue');
    const countAll = document.getElementById('countAll');
    const countPaid = document.getElementById('countPaid');
    const countPending = document.getElementById('countPending');
    const countFailed = document.getElementById('countFailed');

    // Gateway Status Pills
    const statusSupabase = document.getElementById('statusSupabase');
    const statusPaymob = document.getElementById('statusPaymob');
    const statusStripe = document.getElementById('statusStripe');
    const statusTelegram = document.getElementById('statusTelegram');

    // Modal Elements
    const orderDetailModal = document.getElementById('orderDetailModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const modalOrderTitle = document.getElementById('modalOrderTitle');
    const modalOrderContent = document.getElementById('modalOrderContent');
    const btnPrintInvoice = document.getElementById('btnPrintInvoice');

    // Initialize
    function init() {
        setupEventListeners();
        if (authToken) {
            showDashboard();
        } else {
            showLogin();
        }
    }

    function setupEventListeners() {
        // Toggle Password visibility
        btnTogglePass.addEventListener('click', () => {
            const isPassword = adminPasswordInput.type === 'password';
            adminPasswordInput.type = isPassword ? 'text' : 'password';
            btnTogglePass.innerHTML = isPassword ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
        });

        // Login submit
        loginForm.addEventListener('submit', handleLogin);

        // Logout
        btnLogout.addEventListener('click', handleLogout);

        // Auto Refresh toggle
        btnAutoRefresh.addEventListener('click', () => {
            isAutoRefreshActive = !isAutoRefreshActive;
            btnAutoRefresh.classList.toggle('active', isAutoRefreshActive);
            if (isAutoRefreshActive) {
                showToast('تم تفعيل التحديث التلقائي', 'success');
                startAutoRefresh();
            } else {
                showToast('تم إيقاف التحديث التلقائي', 'info');
                stopAutoRefresh();
            }
        });

        // Manual refresh
        btnManualRefresh.addEventListener('click', () => {
            btnManualRefresh.querySelector('i').classList.add('fa-spin');
            loadAllData().finally(() => {
                setTimeout(() => btnManualRefresh.querySelector('i').classList.remove('fa-spin'), 600);
            });
        });

        // Search input
        orderSearchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            renderOrdersTable();
        });

        // Gateway filter
        gatewayFilter.addEventListener('change', (e) => {
            activeGatewayFilter = e.target.value;
            renderOrdersTable();
        });

        // Filter tabs
        filterTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                filterTabs.forEach((t) => t.classList.remove('active'));
                tab.classList.add('active');
                activeFilterStatus = tab.dataset.status;
                renderOrdersTable();
            });
        });

        // Modal close
        btnCloseModal.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);

        // Print invoice
        btnPrintInvoice.addEventListener('click', () => {
            window.print();
        });

        // Export CSV
        btnExportCsv.addEventListener('click', exportToCsv);

        // Modal status actions
        document.querySelectorAll('.btn-action-status').forEach((btn) => {
            btn.addEventListener('click', async () => {
                if (!currentSelectedOrder) return;
                const newStatus = btn.dataset.status;
                await updateOrderStatus(currentSelectedOrder.order_number, newStatus);
            });
        });
    }

    // ----------------------------------------------------------------
    // Authentication Handling
    // ----------------------------------------------------------------
    async function handleLogin(e) {
        e.preventDefault();
        loginAlert.style.display = 'none';

        const username = adminUsernameInput.value.trim();
        const password = adminPasswordInput.value.trim();

        if (!username || !password) return;

        btnLoginSubmit.disabled = true;
        btnLoginSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحقق...';

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'فشل تسجيل الدخول');
            }

            authToken = data.token;
            localStorage.setItem('market_admin_token', authToken);
            if (data.admin && data.admin.username) {
                displayAdminName.textContent = data.admin.fullName || data.admin.username;
            }

            showDashboard();
            showToast('مرحباً بك! تم تسجيل الدخول بنجاح', 'success');
        } catch (err) {
            loginAlert.textContent = err.message;
            loginAlert.style.display = 'block';
        } finally {
            btnLoginSubmit.disabled = false;
            btnLoginSubmit.innerHTML = '<span>دخول للوحة التحكم</span> <i class="fa-solid fa-arrow-left"></i>';
        }
    }

    function handleLogout() {
        authToken = null;
        localStorage.removeItem('market_admin_token');
        sessionStorage.removeItem('market_admin_token');
        stopAutoRefresh();
        showLogin();
        showToast('تم تسجيل الخروج بنجاح', 'info');
    }

    function showLogin() {
        loginSection.style.display = 'flex';
        dashboardSection.style.display = 'none';
    }

    function showDashboard() {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'flex';
        checkGatewayStatus();
        loadAllData();
        if (isAutoRefreshActive) {
            startAutoRefresh();
        }
    }

    // ----------------------------------------------------------------
    // Gateway Status & Config
    // ----------------------------------------------------------------
    async function checkGatewayStatus() {
        try {
            const res = await fetch('/api/config');
            const config = await res.json();

            updatePill(statusSupabase, config.supabaseConfigured);
            updatePill(statusPaymob, config.paymobConfigured);
            updatePill(statusStripe, config.stripeConfigured);
            updatePill(statusTelegram, true); // If server running, telegram is active
        } catch (e) {
            console.error('Failed to load gateway config:', e);
        }
    }

    function updatePill(elem, isConnected) {
        if (!elem) return;
        if (isConnected) {
            elem.classList.add('connected');
            elem.title = 'متصل وجاهز للعمليات';
        } else {
            elem.classList.remove('connected');
            elem.title = 'في وضع المحاكاة أو بانتظار المفاتيح';
        }
    }

    // ----------------------------------------------------------------
    // Data Loading & KPIs
    // ----------------------------------------------------------------
    async function loadAllData() {
        if (!authToken) return;

        try {
            const [ordersRes, statsRes] = await Promise.all([
                fetch('/api/admin/orders', {
                    headers: { Authorization: `Bearer ${authToken}` }
                }),
                fetch('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${authToken}` }
                })
            ]);

            if (ordersRes.status === 401 || ordersRes.status === 403) {
                handleLogout();
                return;
            }

            const ordersData = await ordersRes.json();
            const statsData = await statsRes.json();

            if (ordersData.success) {
                currentOrders = ordersData.orders || [];
                renderOrdersTable();
                updateCounts();
            }

            if (statsData.success && statsData.stats) {
                updateKPIs(statsData.stats);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        }
    }

    function updateKPIs(stats) {
        kpiRevenue.textContent = formatEGP(stats.totalRevenue || 0);
        kpiPaidOrders.textContent = (stats.paidOrdersCount || 0).toLocaleString('ar-EG');
        kpiPendingOrders.textContent = (stats.pendingOrdersCount || 0).toLocaleString('ar-EG');
        kpiAvgValue.textContent = formatEGP(stats.avgOrderValue || 0);
    }

    function updateCounts() {
        const total = currentOrders.length;
        const paid = currentOrders.filter((o) => o.payment_status === 'paid').length;
        const pending = currentOrders.filter((o) => o.payment_status === 'pending').length;
        const failed = currentOrders.filter((o) => o.payment_status === 'failed' || o.payment_status === 'cancelled').length;

        countAll.textContent = total;
        countPaid.textContent = paid;
        countPending.textContent = pending;
        countFailed.textContent = failed;
    }

    // ----------------------------------------------------------------
    // Table Rendering & Filters
    // ----------------------------------------------------------------
    function renderOrdersTable() {
        let filtered = currentOrders.slice();

        // Status Filter
        if (activeFilterStatus !== 'all') {
            if (activeFilterStatus === 'failed') {
                filtered = filtered.filter((o) => o.payment_status === 'failed' || o.payment_status === 'cancelled');
            } else {
                filtered = filtered.filter((o) => o.payment_status === activeFilterStatus);
            }
        }

        // Gateway Filter
        if (activeGatewayFilter) {
            filtered = filtered.filter((o) => (o.payment_gateway || o.payment_method || '').includes(activeGatewayFilter));
        }

        // Search Query
        if (searchQuery) {
            filtered = filtered.filter((o) => {
                const num = (o.order_number || '').toLowerCase();
                const name = (o.customer_name || '').toLowerCase();
                const phone = (o.customer_phone || '').toLowerCase();
                return num.includes(searchQuery) || name.includes(searchQuery) || phone.includes(searchQuery);
            });
        }

        if (filtered.length === 0) {
            ordersTableBody.innerHTML = '';
            emptyOrdersState.style.display = 'block';
            return;
        }

        emptyOrdersState.style.display = 'none';

        ordersTableBody.innerHTML = filtered
            .map((order) => {
                const items = Array.isArray(order.items) ? order.items : [];
                const itemsCount = items.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);
                const itemsSummary = items.map((i) => `${i.title || i.name} (${i.quantity || 1})`).join('، ');

                const gatewayBadge = getGatewayBadge(order.payment_gateway || order.payment_method);
                const statusBadge = getStatusBadge(order.payment_status);
                const dateStr = formatDate(order.created_at);
                const cleanPhone = (order.customer_phone || '').replace(/[^0-9]/g, '');

                return `
                <tr data-order-number="${order.order_number}">
                    <td>
                        <div class="order-num-cell">
                            <span>#${order.order_number}</span>
                        </div>
                    </td>
                    <td>
                        <div class="customer-cell">
                            <span class="customer-name">${escapeHtml(order.customer_name || 'بدون اسم')}</span>
                            <div class="customer-contact">
                                <a href="tel:${cleanPhone}"><i class="fa-solid fa-phone"></i> ${order.customer_phone}</a>
                                <a href="https://wa.me/20${cleanPhone.replace(/^0+/, '')}" target="_blank" class="wa-btn" title="محادثة واتساب">
                                    <i class="fa-brands fa-whatsapp"></i> واتساب
                                </a>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span style="font-weight:600;">${escapeHtml(order.city || 'القاهرة')}</span>
                        <div style="font-size:0.78rem; color:var(--text-muted); max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                            ${escapeHtml(order.customer_address || '')}
                        </div>
                    </td>
                    <td>
                        <div class="items-preview-cell">
                            <span style="font-weight:700;">${itemsCount} منتجات</span>
                            <div class="items-summary-text" title="${escapeHtml(itemsSummary)}">
                                ${escapeHtml(itemsSummary)}
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="price-cell">${formatEGP(order.grand_total)}</span>
                    </td>
                    <td>${gatewayBadge}</td>
                    <td>${statusBadge}</td>
                    <td><span class="date-cell">${dateStr}</span></td>
                    <td class="actions-cell">
                        <button class="btn-view-order" onclick="window.viewOrderDetail('${order.order_number}')">
                            <i class="fa-solid fa-eye"></i> تفاصيل
                        </button>
                    </td>
                </tr>
            `;
            })
            .join('');
    }

    function getGatewayBadge(gateway) {
        const g = (gateway || '').toLowerCase();
        if (g.includes('paymob')) {
            return `<span class="badge-gateway paymob"><i class="fa-solid fa-credit-card"></i> Paymob</span>`;
        } else if (g.includes('stripe')) {
            return `<span class="badge-gateway stripe"><i class="fa-brands fa-stripe"></i> Stripe</span>`;
        } else {
            return `<span class="badge-gateway cod"><i class="fa-solid fa-hand-holding-dollar"></i> عند الاستلام</span>`;
        }
    }

    function getStatusBadge(status) {
        const s = (status || 'pending').toLowerCase();
        if (s === 'paid') {
            return `<span class="badge-status paid"><i class="fa-solid fa-check-circle"></i> مدفوع ✅</span>`;
        } else if (s === 'pending') {
            return `<span class="badge-status pending"><i class="fa-solid fa-clock"></i> قيد الانتظار</span>`;
        } else {
            return `<span class="badge-status failed"><i class="fa-solid fa-xmark-circle"></i> ملغي / فشل</span>`;
        }
    }

    // ----------------------------------------------------------------
    // Order Detail Modal
    // ----------------------------------------------------------------
    window.viewOrderDetail = function (orderNumber) {
        const order = currentOrders.find((o) => o.order_number === orderNumber);
        if (!order) return;

        currentSelectedOrder = order;
        modalOrderTitle.textContent = `#${order.order_number}`;

        const items = Array.isArray(order.items) ? order.items : [];
        const itemsHtml = items
            .map((item) => {
                const variantParts = [item.size ? `مقاس: ${item.size}` : '', item.color ? `لون: ${item.color}` : ''].filter(Boolean);
                const variantStr = variantParts.join(' | ');

                return `
                <div class="modal-item-row">
                    <div class="item-left">
                        <img src="${item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}" class="item-thumb" alt="${escapeHtml(item.title || item.name)}">
                        <div class="item-details">
                            <h4>${escapeHtml(item.title || item.name)}</h4>
                            ${variantStr ? `<div class="item-variant">${escapeHtml(variantStr)}</div>` : ''}
                        </div>
                    </div>
                    <div class="item-right">
                        <div class="item-price-calc">${formatEGP(item.price)} × ${item.quantity || 1}</div>
                        <div class="item-total-price">${formatEGP((item.price || 0) * (item.quantity || 1))}</div>
                    </div>
                </div>
            `;
            })
            .join('');

        const cleanPhone = (order.customer_phone || '').replace(/[^0-9]/g, '');

        modalOrderContent.innerHTML = `
            <!-- Customer Info -->
            <div class="modal-section">
                <h4 class="modal-section-title"><i class="fa-solid fa-user"></i> بيانات العميل والتوصيل</h4>
                <div class="modal-info-grid">
                    <div class="info-item">
                        <span class="info-label">اسم العميل:</span>
                        <span class="info-value">${escapeHtml(order.customer_name)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">رقم الهاتف:</span>
                        <span class="info-value">
                            <a href="tel:${cleanPhone}" style="color:var(--primary-light); text-decoration:none;">${order.customer_phone}</a>
                            &nbsp;(<a href="https://wa.me/20${cleanPhone.replace(/^0+/, '')}" target="_blank" style="color:#25d366; text-decoration:none;"><i class="fa-brands fa-whatsapp"></i> واتساب</a>)
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">المدينة:</span>
                        <span class="info-value">${escapeHtml(order.city || 'القاهرة')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">عنوان التوصيل:</span>
                        <span class="info-value">${escapeHtml(order.customer_address)}</span>
                    </div>
                    ${order.notes ? `
                    <div class="info-item" style="grid-column: span 2;">
                        <span class="info-label">ملاحظات التوصيل:</span>
                        <span class="info-value" style="color:var(--warning);">${escapeHtml(order.notes)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Payment Info -->
            <div class="modal-section">
                <h4 class="modal-section-title"><i class="fa-solid fa-credit-card"></i> بيانات الدفع والعملية</h4>
                <div class="modal-info-grid">
                    <div class="info-item">
                        <span class="info-label">بوابة الدفع:</span>
                        <span class="info-value">${getGatewayBadge(order.payment_gateway || order.payment_method)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">حالة الدفع الحالية:</span>
                        <span class="info-value">${getStatusBadge(order.payment_status)}</span>
                    </div>
                    ${order.payment_id ? `
                    <div class="info-item" style="grid-column: span 2;">
                        <span class="info-label">رقم المرجع / Transaction ID:</span>
                        <span class="info-value" style="font-family:monospace; color:var(--primary-light);">${escapeHtml(order.payment_id)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Items -->
            <div class="modal-section">
                <h4 class="modal-section-title"><i class="fa-solid fa-cart-shopping"></i> المنتجات المطلوبة (${items.length})</h4>
                <div class="modal-items-list">
                    ${itemsHtml || '<div style="padding:16px; text-align:center;">لا توجد منتجات</div>'}
                </div>
            </div>

            <!-- Financials -->
            <div class="modal-totals-box">
                <div class="total-row">
                    <span>المجموع الفرعي:</span>
                    <span>${formatEGP(order.subtotal)}</span>
                </div>
                ${order.discount > 0 ? `
                <div class="total-row" style="color:var(--success);">
                    <span>خصم الكوبون (${escapeHtml(order.promo_code || 'كوبون')}):</span>
                    <span>-${formatEGP(order.discount)}</span>
                </div>
                ` : ''}
                <div class="total-row">
                    <span>رسوم الشحن:</span>
                    <span>${order.shipping > 0 ? formatEGP(order.shipping) : 'مجاني'}</span>
                </div>
                <div class="total-row grand-total">
                    <span>الإجمالي المستحق:</span>
                    <span>${formatEGP(order.grand_total)}</span>
                </div>
            </div>
        `;

        orderDetailModal.style.display = 'flex';
    };

    function closeModal() {
        orderDetailModal.style.display = 'none';
        currentSelectedOrder = null;
    }

    async function updateOrderStatus(orderNumber, newStatus) {
        try {
            const res = await fetch(`/api/admin/orders/${orderNumber}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();
            if (data.success) {
                showToast(`تم تحديث حالة الطلب إلى "${newStatus === 'paid' ? 'مدفوع' : 'قيد الانتظار'}"`, 'success');
                closeModal();
                loadAllData();
            } else {
                showToast(data.message || 'فشل التحديث', 'error');
            }
        } catch (e) {
            showToast('حدث خطأ أثناء التحديث', 'error');
        }
    }

    // ----------------------------------------------------------------
    // Export CSV
    // ----------------------------------------------------------------
    function exportToCsv() {
        if (!currentOrders || currentOrders.length === 0) {
            showToast('لا توجد طلبات للتصدير', 'info');
            return;
        }

        const headers = ['Order Number', 'Customer Name', 'Phone', 'City', 'Address', 'Subtotal', 'Discount', 'Shipping', 'Grand Total', 'Gateway', 'Payment Status', 'Created At'];
        const rows = currentOrders.map((o) => [
            `"${o.order_number}"`,
            `"${(o.customer_name || '').replace(/"/g, '""')}"`,
            `"${o.customer_phone || ''}"`,
            `"${o.city || ''}"`,
            `"${(o.customer_address || '').replace(/"/g, '""')}"`,
            o.subtotal || 0,
            o.discount || 0,
            o.shipping || 0,
            o.grand_total || 0,
            `"${o.payment_gateway || o.payment_method || ''}"`,
            `"${o.payment_status || 'pending'}"`,
            `"${o.created_at || ''}"`
        ]);

        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `market_orders_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('تم تصدير ملف CSV بنجاح', 'success');
    }

    // ----------------------------------------------------------------
    // Auto Refresh
    // ----------------------------------------------------------------
    function startAutoRefresh() {
        stopAutoRefresh();
        autoRefreshTimer = setInterval(() => {
            if (authToken) {
                loadAllData();
            }
        }, 15000);
    }

    function stopAutoRefresh() {
        if (autoRefreshTimer) {
            clearInterval(autoRefreshTimer);
            autoRefreshTimer = null;
        }
    }

    // ----------------------------------------------------------------
    // Utilities
    // ----------------------------------------------------------------
    function formatEGP(amount) {
        return Number(amount || 0).toLocaleString('ar-EG', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }) + ' ج.م';
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('ar-EG', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showToast(message, type = 'info') {
        const container = document.getElementById('adminToastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Run
    init();
})();
