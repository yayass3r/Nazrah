# نظرة (Nazrah) 🎬

تطبيق React Native/Expo للسوق السعودي يربط المستخدمين بمقدمي خدمة الفيديو الموقعيين.

![Expo](https://img.shields.io/badge/Expo-55.0.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.83-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

---

## ✨ الميزات

### 🔐 نظام المصادقة
- تسجيل الدخول بالبريد الإلكتروني
- إنشاء حساب جديد
- تسجيل دخول تجريبي سريع

### 🗺️ الخرائط التفاعلية
- عرض موقع المستخدم الحالي
- عرض مقدمي الخدمة على الخريطة
- طلب الخدمة مباشرة من الخريطة

### 📹 الكاميرا
- تسجيل فيديو حتى 10 ثواني
- تبديل بين الكاميرا الأمامية والخلفية

### 💳 المحفظة السعودية
- **STC Pay**
- **Urpay**
- **مدى**
- **Visa**
- إيداع الرصيد
- سجل المعاملات

### 👤 الملف الشخصي
- عرض معلومات المستخدم
- الإحصائيات (الطلبات، الرصيد، التقييم)
- تسجيل الخروج

---

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 18+
- npm أو yarn
- Expo CLI

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/yayass3r/Nazrah.git

# الدخول للمجلد
cd Nazrah

# تثبيت المكتبات
npm install

# تشغيل التطبيق
npm start
```

---

## 📦 البناء

### بناء APK

```bash
# تسجيل الدخول لـ EAS
npx eas login

# بدء البناء
npx eas build --platform android --profile preview
```

### متابعة البناء
```
https://expo.dev/accounts/yayass3r/projects/nazrah-app/builds
```

---

## 🔑 بيانات الاعتماد

### مستخدم تجريبي
| الحقل | القيمة |
|-------|--------|
| البريد | `demo@nazrah.sa` |
| كلمة المرور | `demo123456` |

---

## 📁 هيكل المشروع

```
nazrah-app/
├── app/
│   ├── _layout.tsx          # التخطيط الرئيسي
│   ├── index.tsx             # شاشة البداية
│   ├── auth.tsx              # شاشة المصادقة
│   └── (tabs)/
│       ├── _layout.tsx       # تخطيط التبويبات
│       ├── index.tsx         # الرئيسية
│       ├── map.tsx           # الخريطة
│       ├── camera.tsx        # الكاميرا
│       ├── wallet.tsx        # المحفظة
│       └── profile.tsx       # الملف الشخصي
├── src/
│   ├── lib/
│   │   └── supabase.ts       # اتصال Supabase
│   └── hooks/
│       └── useAuth.tsx       # إدارة المصادقة
├── assets/                   # الصور والأيقونات
├── app.json                  # إعدادات Expo
├── eas.json                  # إعدادات EAS Build
└── package.json              # المكتبات
```

---

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|----------|
| Expo SDK 55 | منصة التطوير |
| React Native | واجهة المستخدم |
| TypeScript | لغة البرمجة |
| Supabase | قاعدة البيانات والمصادقة |
| Expo Router | التنقل بين الصفحات |
| Expo Camera | الكاميرا |
| Expo Location | الموقع الجغرافي |
| React Native Maps | الخرائط |

---

## 📱 لقطات الشاشة

| الشاشة الرئيسية | الخريطة | المحفظة |
|----------------|---------|---------|
| ![Home](screenshots/home.png) | ![Map](screenshots/map.png) | ![Wallet](screenshots/wallet.png) |

---

## 📄 الرخصة

MIT License

---

## 👨‍💻 المطور

- **GitHub**: [@yayass3r](https://github.com/yayass3r)

---

## 🆘 الدعم

للمساعدة أو الإبلاغ عن مشاكل:
- [فتح Issue](https://github.com/yayass3r/Nazrah/issues)
