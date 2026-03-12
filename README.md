# 🍽️ منصة المطاعم — Backend Monorepo

> مشروع شخصي بذلت فيه جهداً في التخطيط الهندسي والتقني، وتم تنفيذه بالكامل بمساعدة الذكاء الاصطناعي **Claude** من Anthropic خلال مدة لا تتجاوز **8 ساعات عمل**.

---

## 📌 نظرة عامة

هذا المشروع عبارة عن **Backend فقط** لمنصة SaaS متكاملة لإدارة المطاعم متعددة الفروع. تم بناؤه باستخدام معمارية **Microservices Monorepo** مع بوابة API موحدة كنقطة دخول وحيدة.

قدّمت لـ Claude كامل التفاصيل الهندسية والتقنية وقرارات المعمارية، وأنجز المشروع بالكامل — من إنشاء الملفات إلى حل الأخطاء — دون الحاجة لكتابة سطر كود يدوياً.

---

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام |
|---|---|
| **NestJS v11** | إطار العمل الأساسي لجميع الخدمات |
| **TypeScript** | لغة البرمجة الأساسية |
| **PostgreSQL 16** | قاعدة البيانات |
| **TypeORM** | ORM للتعامل مع قاعدة البيانات |
| **JWT** | المصادقة والتفويض |
| **pnpm Workspaces** | إدارة الـ Monorepo |
| **Docker Compose** | تشغيل قاعدة البيانات محلياً |
| **Swagger (OpenAPI)** | توثيق الـ API |
| **concurrently** | تشغيل جميع الخدمات بأمر واحد |

---

## 🏗️ معمارية المشروع

```
restaurant-platform/
├── services/
│   ├── api-gateway/          → البوابة الرئيسية (Port 3000)
│   ├── identity-service/     → المصادقة والمستخدمون (Port 3001)
│   ├── store-service/        → المتاجر والفروع (Port 3002)
│   ├── catalog-service/      → المنتجات والتصنيفات (Port 3003)
│   ├── promotion-service/    → العروض والكوبونات (Port 3004)
│   ├── order-service/        → الطلبات (Port 3005)
│   ├── customer-service/     → ملفات العملاء (Port 3006)
│   └── notification-service/ → الإشعارات (Port 3007)
├── packages/
│   ├── database/             → إعدادات TypeORM المشتركة
│   └── shared/               → Enums، Interfaces، Decorators
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

جميع الطلبات تمر عبر **API Gateway** على البورت `3000`، والخدمات الداخلية تتواصل فيما بينها عبر HTTP.

---

## 🚀 كيفية تشغيل المشروع

### المتطلبات الأساسية

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v8+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

### الخطوة 1 — تثبيت المكتبات

```bash
pnpm install
```

---

### الخطوة 2 — تشغيل قاعدة البيانات عبر Docker

```bash
docker-compose up -d
```

هذا الأمر سيشغّل PostgreSQL على البورت `5432` في الخلفية.

للتحقق أن الكونتينر شغّال:

```bash
docker ps
```

لإيقاف قاعدة البيانات:

```bash
docker-compose down
```

---

### الخطوة 3 — إعداد متغيرات البيئة

أنشئ ملف `.env` في كل خدمة بناءً على المثال التالي:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=restaurant_user
DB_PASSWORD=restaurant_pass
DB_NAME=restaurant_db
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=development
PORT=300X   # غيّر الرقم حسب كل خدمة
```

| الخدمة | PORT |
|---|---|
| api-gateway | 3000 |
| identity-service | 3001 |
| store-service | 3002 |
| catalog-service | 3003 |
| promotion-service | 3004 |
| order-service | 3005 |
| customer-service | 3006 |
| notification-service | 3007 |

---

### الخطوة 4 — تشغيل جميع الخدمات

```bash
pnpm dev
```

سيتم تشغيل جميع الخدمات الثمانية في وقت واحد.

لتشغيل خدمة واحدة بشكل منفرد:

```bash
pnpm dev:gateway
pnpm dev:identity
pnpm dev:store
pnpm dev:catalog
pnpm dev:promotion
pnpm dev:order
pnpm dev:customer
pnpm dev:notification
```

---

## 📚 توثيق API (Swagger)

بعد تشغيل الخدمات، يمكن الوصول لتوثيق كل خدمة من خلال:

| الخدمة | رابط التوثيق |
|---|---|
| API Gateway (كل الخدمات) | http://localhost:3000/docs |
| Identity Service | http://localhost:3001/docs |
| Store Service | http://localhost:3002/docs |
| Catalog Service | http://localhost:3003/docs |
| Promotion Service | http://localhost:3004/docs |
| Order Service | http://localhost:3005/docs |
| Customer Service | http://localhost:3006/docs |
| Notification Service | http://localhost:3007/docs |

> صفحة `http://localhost:3000/docs` تعرض جميع الخدمات في واجهة موحدة مع Dropdown للتنقل بينها.

---

## 🔌 الخدمات والمسارات

### 1. Identity Service — المصادقة

| الطريقة | المسار | الوصف |
|---|---|---|
| POST | `/api/v1/auth/merchant/register` | تسجيل تاجر جديد |
| POST | `/api/v1/auth/merchant/login` | تسجيل دخول التاجر |
| POST | `/api/v1/auth/customer/send-otp` | إرسال OTP للعميل |
| POST | `/api/v1/auth/customer/verify-otp` | التحقق من OTP والحصول على Token |

---

### 2. Store Service — المتاجر والفروع

| الطريقة | المسار | الوصف |
|---|---|---|
| POST | `/api/v1/stores` | إنشاء متجر جديد |
| GET | `/api/v1/stores` | جلب متاجر التاجر |
| GET | `/api/v1/stores/:id` | جلب متجر بالمعرّف |
| PUT | `/api/v1/stores/:id` | تعديل المتجر |
| DELETE | `/api/v1/stores/:id` | حذف المتجر |
| GET | `/api/v1/stores/slug/:slug` | جلب المتجر بالـ Slug |
| GET/PUT | `/api/v1/stores/:storeId/appearance` | مظهر المتجر |
| POST | `/api/v1/branches` | إضافة فرع |
| PUT | `/api/v1/branches/:id` | تعديل فرع |
| DELETE | `/api/v1/branches/:id` | حذف فرع |
| POST/GET | `/api/v1/branches/:branchId/working-hours` | أوقات العمل |

---

### 3. Catalog Service — المنتجات والتصنيفات

| الطريقة | المسار | الوصف |
|---|---|---|
| POST/GET | `/api/v1/stores/:storeId/categories` | التصنيفات |
| PUT/DELETE | `/api/v1/stores/:storeId/categories/:id` | تعديل/حذف تصنيف |
| POST/GET | `/api/v1/stores/:storeId/products` | المنتجات |
| GET | `/api/v1/stores/:storeId/products/:id` | منتج بالمعرّف |
| PUT/DELETE | `/api/v1/stores/:storeId/products/:id` | تعديل/حذف منتج |
| POST/GET | `/api/v1/products/:productId/variants` | المتغيرات |
| POST/GET | `/api/v1/products/:productId/modifiers` | الإضافات |

---

### 4. Promotion Service — العروض والكوبونات

| الطريقة | المسار | الوصف |
|---|---|---|
| POST/GET | `/api/v1/stores/:storeId/promotions` | العروض |
| GET | `/api/v1/stores/:storeId/promotions/active` | العروض النشطة |
| PUT/DELETE | `/api/v1/stores/:storeId/promotions/:id` | تعديل/حذف عرض |
| POST/GET | `/api/v1/stores/:storeId/promo-codes` | أكواد الخصم |
| POST | `/api/v1/stores/:storeId/promo-codes/validate` | التحقق من كود خصم |
| DELETE | `/api/v1/stores/:storeId/promo-codes/:id` | حذف كود |

---

### 5. Order Service — الطلبات

| الطريقة | المسار | الوصف |
|---|---|---|
| POST | `/api/v1/orders` | إنشاء طلب جديد |
| GET | `/api/v1/orders/store/:storeId` | طلبات المتجر |
| GET | `/api/v1/orders/my/:storeId` | طلبات العميل |
| GET | `/api/v1/orders/:id` | طلب بالمعرّف |
| PUT | `/api/v1/orders/:id/status` | تحديث حالة الطلب |

---

### 6. Customer Service — ملفات العملاء

| الطريقة | المسار | الوصف |
|---|---|---|
| GET | `/api/v1/customers/store/:storeId` | عملاء المتجر |
| GET | `/api/v1/customers/me/:storeId` | ملف العميل الحالي |
| PUT | `/api/v1/customers/me/:storeId` | تعديل الملف |
| GET | `/api/v1/customers/me/:storeId/orders` | طلبات العميل |
| POST/GET | `/api/v1/customers/me/:storeId/addresses` | العناوين |
| PUT/DELETE | `/api/v1/customers/me/:storeId/addresses/:id` | تعديل/حذف عنوان |
| PUT | `/api/v1/customers/me/:storeId/addresses/:id/default` | تعيين عنوان افتراضي |

---

### 7. Notification Service — الإشعارات

| الطريقة | المسار | الوصف |
|---|---|---|
| POST | `/api/v1/notifications/send` | إرسال إشعار |
| GET | `/api/v1/notifications/customer/:customerId` | إشعارات العميل |
| GET | `/api/v1/notifications/store/:storeId` | إشعارات المتجر |

---

## 🔄 التواصل بين الخدمات

```
order-service      → promotion-service   (التحقق من أكواد الخصم)
customer-service   → order-service       (جلب طلبات العميل)
```

جميع الاتصالات الداخلية تتم عبر HTTP.

---

## 🤖 دور الذكاء الاصطناعي في المشروع

هذا المشروع هو نتيجة تجربة عملية في استخدام الذكاء الاصطناعي في التطوير الفعلي. قدّمت لـ **Claude** من Anthropic:

- المتطلبات الوظيفية الكاملة للمنصة
- قرارات المعمارية (Microservices، Monorepo، API Gateway)
- الـ Stack التقني المحدد
- التصميم الهيكلي للخدمات وعلاقاتها

وقام Claude بـ:

- إنشاء جميع الملفات والكود من الصفر
- حل جميع الأخطاء التي ظهرت أثناء التطوير
- اتخاذ القرارات التقنية الصحيحة في كل مرحلة

**النتيجة:** مشروع Backend متكامل جاهز للتطوير في أقل من **8 ساعات عمل**.

---

## 👤 صاحب المشروع

مشروع شخصي أُنجز بجهد حقيقي في التخطيط الهندسي والتوجيه التقني، مع الاستفادة الكاملة من إمكانيات الذكاء الاصطناعي في التنفيذ.

---

## 📄 الترخيص

MIT