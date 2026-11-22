# 📱 تطبيق Market.com للموبايل (Android & iOS)

تطبيق الموبايل الرسمي لمتجر **Market.com**، مبني باستخدام **Capacitor 6**، يدعم اللغتين (العربية والإنجليزية) مع التبديل الفوري، ويدعم العمل بدون إنترنت (PWA Offline Caching)، وتكامل بوابات الدفع (Paymob، Stripe، والمحافظ الإلكترونية).

---

## 🔒 التحسينات الأمنية وإصلاح الثغرات (Security Audits & Hardening)
1. **منع المحتوى المختلط (Mixed Content Disabled):**
   - تم ضبط `allowMixedContent: false` في `capacitor.config.json` لضمان عدم تحميل أي نصوص برمجية غير مشفرة (HTTP) داخل WebView.
2. **حظر النسخ الاحتياطي غير الآمن (Android Backup Disabled):**
   - ضبط `android:allowBackup="false"` في إعدادات التطبيق لمنع سحب بيانات الجلسات والتخزين المحلي عبر ADB.
3. **تأمين الاتصال والواجهة الخلفية (Backend API Security):**
   - استخدام `window.MARKET_API_BASE` للاتصال الآمن بـ HTTPS.
   - حظر ثغرات التحقق من توقيع الـ Webhooks (Paymob HMAC و Stripe Webhook Secret).
   - تفعيل Rate Limiting على نقاط الدخول لحماية التطبيق من هجمات التخمين والفيضان.
4. **عزل ملفات السيرفر وقاعدة البيانات:**
   - الواجهة الثابتة فقط (`mobile-web/`) هي التي تُحزم داخل التطبيق، دون وجود أي أسرار أو ملفات backend في الحزمة.

---

## 🚀 كيفية بناء وتشغيل التطبيق (Build & Run)

### 1. تثبيت الحزم المطلوبة:
```bash
npm install
```

### 2. تجهيز ومزامنة ملفات الويب:
```bash
npm run prepare:mobile
npx cap sync
```

### 3. تشغيل تطبيق الأندرويد في Android Studio:
```bash
npx cap open android
```
ثم النقر على **Run** أو **Build > Build APK**.

### 4. تشغيل تطبيق iOS في Xcode (على أنظمة macOS):
```bash
npx cap open ios
```
