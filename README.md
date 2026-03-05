# نظرة (Nazrah) 🎬

<div align="center">
  <img src="assets/icon.png" alt="Nazrah Logo" width="120" height="120">
  
  **تطبيق خدمات الفيديو للمملكة العربية السعودية**
  
  [![Expo](https://img.shields.io/badge/Expo-55.0.0-blue?style=flat-square)](https://expo.dev)
  [![React Native](https://img.shields.io/badge/React%20Native-0.83-green?style=flat-square)](https://reactnative.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square)](https://www.typescriptlang.org)
  [![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
</div>

---

## 📱 حول التطبيق

**نظرة** هو تطبيق React Native متكامل يربط المستخدمين بمقدمي خدمات الفيديو في المملكة العربية السعودية. يوفر التطبيق تجربة مستخدم سلسة مع دعم كامل للغة العربية واتجاه RTL.

---

## ✨ الميزات الرئيسية

### 🔐 نظام المصادقة المتكامل
- تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
- إنشاء حساب جديد مع التحقق من البريد
- **وضع تجريبي** يعمل بدون إنترنت للتجربة السريعة
- إدارة الجلسات مع حفظ محلي

### 🗺️ الخرائط التفاعلية
- عرض موقع المستخدم الحالي
- عرض مقدمي الخدمة على الخريطة
- **OpenStreetMap مجاني** - بدون API Key
- تصفية مقدمي الخدمة حسب الموقع
- حجز الخدمة مباشرة من الخريطة

### 📹 الكاميرا
- تسجيل فيديو حتى 10 ثواني
- تبديل بين الكاميرا الأمامية والخلفية
- مؤشر وقت التسجيل
- جودة عالية (720p)

### 💳 المحفظة السعودية
- **STC Pay** - مدفوعات سريعة
- **Urpay** - محفظة رقمية
- **مدى** - بطاقات محلية
- **Visa/Mastercard** - بطاقات دولية
- سجل المعاملات الكامل
- إيداع الرصيد بسهولة

### 👤 الملف الشخصي
- عرض وتعديل المعلومات الشخصية
- إحصائيات المستخدم (الطلبات، الرصيد، التقييم)
- إدارة الإشعارات
- تسجيل الخروج

---

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام | الإصدار |
|---------|----------|---------|
| Expo SDK | منصة التطوير | 55.0.0 |
| React Native | واجهة المستخدم | 0.83 |
| TypeScript | لغة البرمجة | 5.9 |
| Supabase | Backend + Auth + DB | 2.x |
| Expo Router | التنقل بين الصفحات | 55.x |
| Expo Camera | الكاميرا | 55.x |
| Expo Location | الموقع الجغرافي | 55.x |
| React Native Maps | الخرائط | 1.26 |
| OpenStreetMap | بلاط الخرائط | مجاني |

---

## 📁 هيكل المشروع

```
nazrah-app/
├── app/                          # شاشات التطبيق
│   ├── _layout.tsx              # التخطيط الرئيسي + RTL
│   ├── index.tsx                # شاشة البداية
│   ├── auth.tsx                 # شاشة المصادقة
│   └── (tabs)/                  # شاشات التبويبات
│       ├── _layout.tsx          # تخطيط التبويبات
│       ├── index.tsx            # الرئيسية
│       ├── map.tsx              # الخريطة
│       ├── camera.tsx           # الكاميرا
│       ├── wallet.tsx           # المحفظة
│       └── profile.tsx          # الملف الشخصي
├── src/
│   ├── lib/
│   │   └── supabase.ts          # اتصال Supabase
│   └── hooks/
│       └── useAuth.tsx          # إدارة المصادقة
├── assets/                       # الصور والأيقونات
├── app.json                      # إعدادات Expo
├── eas.json                      # إعدادات EAS Build
├── package.json                  # المكتبات
└── tsconfig.json                 # إعدادات TypeScript
```

---

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 18+
- npm أو yarn أو bun
- Expo CLI

### خطوات التثبيت

```bash
# 1. استنساخ المشروع
git clone https://github.com/yayass3r/Nazrah.git

# 2. الدخول للمجلد
cd Nazrah

# 3. تثبيت المكتبات
npm install

# 4. تشغيل التطبيق
npm start
```

### تشغيل على جهاز حقيقي

```bash
# Android
npm run android

# iOS (يتطلب macOS)
npm run ios
```

---

## 📦 البناء والنشر

### بناء APK (للاختبار)

```bash
# تسجيل الدخول
npx eas login

# بناء APK
npx eas build --platform android --profile preview
```

### بناء AAB (للمتجر)

```bash
# بناء للإنتاج
npx eas build --platform android --profile production
```

### النشر على Google Play

```bash
npx eas submit --platform android
```

---

## 🔑 بيانات الاعتماد

### مستخدم تجريبي
| الحقل | القيمة |
|-------|--------|
| البريد | `demo@nazrah.sa` |
| كلمة المرور | `demo123456` |

### Supabase
| البيانات | القيمة |
|----------|--------|
| URL | `https://pzixmpqemignqmgslovx.supabase.co` |

---

## 🌐 دعم RTL

التطبيق يدعم اللغة العربية بشكل كامل:
- اتجاه من اليمين لليسار (RTL)
- نصوص عربية في جميع الشاشات
- تخطيط متوافق مع العربية
- خطوط واضحة ومقروءة

---

## 📸 لقطات الشاشة

<div align="center">
  <img src="screenshots/home.png" width="200" alt="الرئيسية">
  <img src="screenshots/map.png" width="200" alt="الخريطة">
  <img src="screenshots/wallet.png" width="200" alt="المحفظة">
  <img src="screenshots/profile.png" width="200" alt="الملف الشخصي">
</div>

---

## 📋 قائمة المهام

- [x] نظام المصادقة
- [x] الخرائط التفاعلية
- [x] الكاميرا
- [x] المحفظة السعودية
- [x] الملف الشخصي
- [ ] إشعارات Push
- [ ] نظام التقييمات
- [ ] نظام المحادثات
- [ ] لوحة تحكم للمزودين
- [ ] دعم iOS

---

## 🤝 المساهمة

نسعد بمساهماتكم! يرجى:

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

---

## 📄 الرخصة

MIT License - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 👨‍💻 المطور

**Yasser**
- GitHub: [@yayass3r](https://github.com/yayass3r)

---

## 🆘 الدعم والتواصل

- **المشاكل**: [فتح Issue](https://github.com/yayass3r/Nazrah/issues)
- **الاقتراحات**: [مناقشات GitHub](https://github.com/yayass3r/Nazrah/discussions)

---

<div align="center">
  <strong>صنع بـ ❤️ في السعودية 🇸🇦</strong>
</div>
