# تطبيق نظرة (Nazrah) - دليل النشر

## معلومات البناء الحالي

- **Build ID**: `cde9c174-d819-42e9-9a2c-894c80fa6919`
- **رابط المتابعة**: https://expo.dev/accounts/yayass3r/projects/nazrah-app/builds/cde9c174-d819-42e9-9a2c-894c80fa6919
- **الحالة**: قيد البناء

## الميزات المتضمنة

1. **المصادقة**
   - تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
   - إنشاء حساب جديد
   - تسجيل الدخول التجريبي (Demo User)

2. **الخرائط**
   - عرض موقع المستخدم
   - عرض مقدمي الخدمة على الخريطة
   - طلب الخدمة مباشرة من الخريطة

3. **الكاميرا**
   - تسجيل فيديو حتى 10 ثواني
   - تبديل بين الكاميرا الأمامية والخلفية

4. **المحفظة**
   - عرض الرصيد الحالي
   - إيداع رصيد
   - بوابات دفع سعودية (STC Pay, Urpay, Mada, Visa)
   - سجل المعاملات

5. **الملف الشخصي**
   - عرض معلومات المستخدم
   - الإحصائيات
   - تسجيل الخروج

## خطوات النشر من الموبايل

### الطريقة 1: عبر متابعة البناء الحالي

1. افتح الرابط في المتصفح:
   ```
   https://expo.dev/accounts/yayass3r/projects/nazrah-app/builds/cde9c174-d819-42e9-9a2c-894c80fa6919
   ```

2. انتظر حتى يكتمل البناء (عادة 10-15 دقيقة)

3. عند اكتمال البناء، اضغط على "Install" لتنزيل APK

### الطريقة 2: بناء جديد

إذا أردت بناء جديد، استخدم الأوامر التالية في Terminal:

```bash
# 1. الذهاب لمجلد المشروع
cd /home/z/my-project/nazrah-app

# 2. بدء بناء جديد
EXPO_TOKEN="cJ9OIBu-GnAw-LiRTnt9Q_b0jABMUTqY_1Gdy9tt" ./node_modules/.bin/eas build --platform android --profile preview --non-interactive --no-wait

# 3. متابعة البناء
EXPO_TOKEN="cJ9OIBu-GnAw-LiRTnt9Q_b0jABMUTqY_1Gdy9tt" ./node_modules/.bin/eas build:list
```

## بيانات الاعتماد

| الخدمة | القيمة |
|--------|--------|
| Expo Username | `yayass3r` |
| Expo Token | `cJ9OIBu-GnAw-LiRTnt9Q_b0jABMUTqY_1Gdy9tt` |
| Supabase URL | `https://pzixmpqemigbnqmgslovx.supabase.co` |
| Project ID | `f076c218-a55b-4daf-85a6-4e4e104e6cc0` |

## مستخدم تجريبي

- **البريد الإلكتروني**: `demo@nazrah.sa`
- **كلمة المرور**: `demo123456`

## هيكل المشروع

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
├── app.json                  # إعدادات Expo
├── eas.json                  # إعدادات EAS Build
└── package.json              # المكتبات
```

## ملاحظات مهمة

1. **الخرائط**: تحتاج إلى Google Maps API Key لعرض الخرائط. قم بإضافته في `app.json`:
   ```json
   "android": {
     "config": {
       "googleMaps": {
         "apiKey": "YOUR_API_KEY"
       }
     }
   }
   ```

2. **الأيقونات**: قم بتغيير الأيقونات في مجلد `assets/` حسب رغبتك

3. **RTL**: التطبيق يدعم اللغة العربية بشكل كامل مع اتجاه من اليمين لليسار

## للدعم

- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
