# راهنمای Deploy پروژه Pietra Luxe Hub

## 🚀 Deploy Frontend در Vercel

پروژه frontend به صورت خودکار در Vercel deploy می‌شود. فایل‌های استاتیک (تصاویر، ویدیوها، PDFها) باید در پوشه `public` قرار گیرند.

### مراحل Deploy:

1. **اطمینان از کپی شدن فایل‌های استاتیک:**
   - فایل‌های `Content/` باید در `public/Content/` باشند
   - فایل‌های `ALMAS/` باید در `public/ALMAS/` باشند
   - فایل‌های `DECORED/` باید در `public/DECORED/` باشند

2. **تنظیمات Vercel:**
   - فایل `vercel.json` برای تنظیمات استفاده می‌شود
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables در Vercel:**
   - `VITE_API_URL`: URL بک‌اند (مثلاً: `https://your-backend.vercel.app` یا `https://api.yourdomain.com`)

## 🔧 Deploy Backend

بک‌اند Express باید جداگانه deploy شود. چند گزینه وجود دارد:

### گزینه 1: Deploy در Vercel به عنوان Serverless Functions

1. ایجاد پوشه `api/` در root پروژه
2. تبدیل routes به serverless functions
3. استفاده از Vercel CLI برای deploy

### گزینه 2: Deploy در سرویس جداگانه (توصیه می‌شود)

#### استفاده از Railway:
1. ایجاد حساب در [Railway.app](https://railway.app)
2. اتصال GitHub repository
3. انتخاب پوشه `backend/`
4. تنظیم Environment Variables:
   - `PORT`: 3001
   - `NODE_ENV`: production
   - `SESSION_SECRET`: یک secret key قوی
   - `DATABASE_PATH`: مسیر دیتابیس

#### استفاده از Render:
1. ایجاد حساب در [Render.com](https://render.com)
2. ایجاد Web Service جدید
3. اتصال GitHub repository
4. تنظیمات:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
   - Environment: Node

#### استفاده از Heroku:
1. نصب Heroku CLI
2. ایجاد app جدید: `heroku create your-app-name`
3. Deploy: `git subtree push --prefix backend heroku main`

### گزینه 3: VPS/Server اختصاصی

1. نصب Node.js و npm
2. Clone کردن repository
3. نصب dependencies: `cd backend && npm install`
4. اجرای با PM2: `pm2 start backend/server.js --name pietra-backend`
5. تنظیم Nginx به عنوان reverse proxy

## 📝 Environment Variables مورد نیاز

### Frontend (.env):
```env
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env):
```env
PORT=3001
NODE_ENV=production
SESSION_SECRET=your-secret-key-here
DATABASE_PATH=./database.db
```

## 🔍 بررسی مشکلات رایج

### مشکل: تصاویر نمایش داده نمی‌شوند
**راه حل:**
- اطمینان از کپی شدن فایل‌ها به `public/`
- بررسی مسیرهای فایل‌ها در کد
- بررسی Cache-Control headers در Vercel

### مشکل: API کار نمی‌کند
**راه حل:**
- بررسی `VITE_API_URL` در Vercel Environment Variables
- بررسی CORS settings در بک‌اند
- بررسی logs بک‌اند برای خطاها

### مشکل: Database کار نمی‌کند
**راه حل:**
- اطمینان از وجود فایل database در production
- بررسی write permissions
- استفاده از database cloud service (مثل Supabase یا PlanetScale)

## 📦 Build و Test محلی

```bash
# Build frontend
npm run build

# Preview build
npm run preview

# Test backend
cd backend
npm start
```

## 🌐 Domain و SSL

برای استفاده از domain اختصاصی:
1. تنظیم DNS records در Vercel
2. اضافه کردن domain در Vercel dashboard
3. SSL به صورت خودکار فعال می‌شود

## 📊 Monitoring

- استفاده از Vercel Analytics برای frontend
- استفاده از Sentry برای error tracking
- استفاده از LogRocket برای session replay

