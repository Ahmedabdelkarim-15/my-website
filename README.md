# 🛒 market.com — منصة التجارة الإلكترونية المصرية المتكاملة

> **متجر إلكتروني متكامل وعصري للملابس، المنتجات الغذائية، والأدوات المنزلية**  
> مدعوم بنظام خلفي (Backend) متكامل لإدارة الطلبات، قاعدة بيانات سحابية Supabase، بوابات دفع Paymob و Stripe مع Webhooks حية، لوحة تحكم للتاجر `/admin` محمية بتسجيل دخول، وإشعارات فورية عبر Telegram Bot.

---

## 🌟 الميزات الجديدة في نظام إدارة الطلبات (Order Management System)

### 1. 🗄️ ربط قاعدة البيانات السحابية (Supabase Database):
- جدول متكامل للطلبات `public.orders` يحفظ:
  - رقم الطلب الفريد (`order_number`) مثل `#ORD-20261121-8619`.
  - بيانات العميل الشخصية (الاسم، الهاتف، العنوان بالتفصيل، المدينة، الملاحظات).
  - مصفوفة المنتجات (`items` JSONB) مع المقاس واللون المختار والكمية وسعر الوحدة.
  - الحسابات المالية: المجموع الفرعي، الخصم، كوبون التخفيض، رسوم الشحن، والإجمالي النهائي بالجنيه.
  - تفاصيل الدفع: طريقة الدفع، البوابة المستخدمة، حالة الدفع (`pending`, `paid`, `failed`)، ورقم المعاملة المرجعي (`payment_id`).
- جدول للمسؤولين `public.admin_users` مع كلمات مرور مشفرة بـ bcrypt وصلاحيات JWT.
- سياسات حماية البيانات (Row Level Security - RLS) ومؤشرات سريعة (Indexes) للاستعلام اللحظي.
- ملف الاسكيما الجاهز للتنفيذ بنقرة واحدة: `supabase/schema.sql`.

### 2. 💳 بوابات الدفع الإلكتروني والـ Webhooks التلقائية:
- **بوابة Paymob (مصر)**:
  - دعم كامل للبطاقات البنكية المصرية (فيزا، ماستركارد، وميزة الوطنية).
  - دعم المحافظ الذكية (فودافون كاش، أورنج كاش، اتصالات، WE Pay) عبر `POST /api/checkout/paymob`.
  - معالجة الـ Webhook التلقائي عبر `POST /api/webhooks/paymob` مع التحقق من توقيع HMAC SHA512 وتحويل حالة الطلب تلقائياً إلى `paid`.
- **بوابة Stripe (العالمية)**:
  - دفع آمن بالبطاقات الدولية و Apple Pay / Google Pay عبر `POST /api/checkout/stripe`.
  - نقطة استقبال Webhook الموثقة عبر `POST /api/webhooks/stripe` مع فحص التوقيع الرقمي `stripe-signature`.
- **الدفع عند الاستلام (COD) وإنستاباي (InstaPay)**:
  - تسجيل فوري للطلب مع إرسال إشعار للمتجر وتوليد فاتورة الواتساب التلقائية.

### 3. 👑 لوحة تحكم التاجر المتقدمة (`/admin`):
- وصول مباشر عبر الرابط: `http://localhost:8080/admin` (أو مسار المتجر الخاص بك).
- حماية أمنية بتسجيل دخول مشفر عبر رموز JWT وجلسات آمنة:
- بطاقات المؤشرات اللحظية (KPIs):
  - 💰 إجمالي المبيعات المدفوعة بالجنيه المصري.
  - 📦 عدد الطلبات المدفوعة الجاهزة للشحن.
  - ⏳ عدد الطلبات قيد الانتظار.
  - 📊 متوسط قيمة الطلب (Average Order Value).
- جدول تفاعلي شامل للطلبات:
  - فلاتر سريعة: الكل، المدفوعة فقط ✅، قيد الانتظار ⏳، ولم تكتمل ❌.
  - فلترة بحسب بوابة الدفع (Paymob, Stripe, COD).
  - بحث فوري برقم الطلب، اسم العميل، أو رقم الهاتف.
  - زر محادثة واتساب مباشر بنقرة واحدة لكل عميل.
  - نافذة منبثقة لتفاصيل الطلب مع خيار طباعة الفاتورة الفورية (`window.print`).
  - تحديث حي تلقائي (Live Polling كل 15 ثانية) وإمكانية تصدير البيانات إلى ملف CSV.

### 4. 🔔 إشعارات Telegram Bot الفورية:
- إرسال تفاصيل كل طلب فور نجاح عملية الدفع عبر البوت المباشر.
- رسالة منسقة باللغة العربية تشمل: رقم الطلب، اسم العميل، رقم الهاتف مع رابط واتساب، العنوان، تفاصيل المنتجات والمقاسات والألوان، الحسابات المالية، وبوابة الدفع المستخدمة.

---

## 📁 هيكل ملفات المشروع المحدث

```
website/
├── server.js               ← سيرفر Express الأساسي (الواجهات، Webhooks، والمصادقة)
├── package.json            ← اعتمادات وحزم المشروع (Express, Supabase, Stripe, Axios, etc.)
├── .env.example            ← قالب مفاتيح وبيانات الربط للبوابات وقاعدة البيانات
├── .gitignore              ← حماية المفاتيح والحزم من الرفع على Git
├── supabase/
│   └── schema.sql          ← اسكيما قاعدة البيانات لإنشاء الجداول والسياسات
├── services/
│   ├── supabase.js         ← عميل وقواعد بيانات Supabase مع وضع المحاكاة الذاتي
│   ├── paymob.js           ← تكامل بوابة Paymob وتوليد الـ iFrame وفحص الـ HMAC
│   ├── stripe.js           ← تكامل جلسات دفع Stripe والتحقق من التوقيع الرقمي
│   └── telegram.js         ← خدمة إرسال إشعارات التليجرام الفورية
├── admin/
│   ├── index.html          ← واجهة لوحة تحكم التاجر وتاريخ الطلبات
│   ├── admin.css           ← تصميم لوحة التحكم (RTL زجاجي وعصري)
│   └── admin.js            ← منطق لوحة التحكم، الإحصائيات، وتحديث الحالات
├── order-success.html      ← صفحة تأكيد واستلام الطلب للعميل
├── index.html              ← المتجر الرئيسي (السلة، المنتجات، الدفع المتعدد)
├── css/
│   └── styles.css          ← ثيمات الأقسام والتصميم المتجاوب
├── js/
│   ├── products.js         ← كتالوج المنتجات وكوبونات الخصم
│   └── app.js              ← منطق الشراء، التفاعل مع الـ API، والواتساب
└── README.md               ← الدليل التوثيقي الشامل
```

---

## ⚙️ خطوات تشغيل المتجر وإعداد المفاتيح

### 1. تشغيل السيرفر محلياً:
```bash
# تثبيت الحزم (إذا لزم الأمر)
npm install

# تشغيل السيرفر
npm start
```
- رابط المتجر: `http://localhost:8080`
- رابط لوحة التحكم: `http://localhost:8080/admin`

### 2. إعداد المفاتيح في ملف `.env`:
انسخ ملف `.env.example` إلى `.env` وضع المفاتيح الخاصة بك:
```ini
PORT=8080
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_JWT_SECRET=

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paymob
PAYMOB_API_KEY=your_paymob_api_key
PAYMOB_INTEGRATION_ID_CARD=your_card_integration_id
PAYMOB_INTEGRATION_ID_WALLET=your_wallet_integration_id
PAYMOB_IFRAME_ID=your_iframe_id
PAYMOB_HMAC_SECRET=your_hmac_secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Telegram Bot
TELEGRAM_BOT_TOKEN=123456789:ABC...
TELEGRAM_CHAT_ID=your_telegram_id
```

### 3. تفعيل قاعدة بيانات Supabase:
1. أنشئ مشروعاً جديداً على [Supabase.com](https://supabase.com).
2. ادخل على **SQL Editor**.
3. انسخ محتوى ملف `supabase/schema.sql` والصقه واضغط **Run**.

---

## 🌐 روابط الـ Webhook للبوابات عند النشر:
- **Paymob Callback URL:** `https://your-domain.com/api/webhooks/paymob`
- **Stripe Webhook URL:** `https://your-domain.com/api/webhooks/stripe`

---

**market.com — تجربة تسوق وتجارة إلكترونية ذكية متكاملة 🇪🇬**


## Security configuration and deployment

The backend requires these environment variables. There are no default admin credentials:

- `ADMIN_USERNAME`: merchant administrator login name.
- `ADMIN_PASSWORD`: unique administrator password, at least 16 characters.
- `ADMIN_JWT_SECRET`: independently generated random signing secret, at least 32 characters.

Set actual values in the backend host's environment/secrets settings, not in Git or browser code. For local development only, use an untracked `.env` file. Startup fails with the missing variable name if a required value is absent. Do not reuse example values. Restart/redeploy after configuration changes.

Only `public/` is served by Express. Browser files now live under `public/`; server code, `services/`, `supabase/`, and environment files must stay outside it. Relative browser URLs are unchanged. Start the backend from the repository root with `npm start` after installing dependencies. The old root-level file tree above is historical; the public assets have moved.

Cloudflare Pages alone can serve the `public/` frontend but cannot run this Express backend. Set its output directory to `public` if deploying the frontend there. The API needs a Node-capable backend host or a separate Cloudflare Functions/Workers adaptation. Do not claim that static deployment enables payments or order storage.

If the old SQL seed was already run, remove or disable the demo administrator in the database separately before launch. Removing the seed from this file does not remove existing accounts. Changing the JWT signing secret invalidates existing admin sessions. This patch does not configure or rotate third-party secrets.
