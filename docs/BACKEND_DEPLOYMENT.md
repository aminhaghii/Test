# راهنمای Deploy Backend در Vercel

## ⚠️ محدودیت‌های SQLite در Serverless

SQLite در محیط‌های serverless (مثل Vercel) محدودیت‌هایی دارد:
- فایل سیستم read-only است
- نمی‌توان database را write کرد
- هر function invocation یک instance جداگانه است

## راه حل‌های پیشنهادی

### گزینه 1: Deploy جداگانه (توصیه می‌شود)

Backend را در یک سرویس جداگانه deploy کنید:

#### Railway.app
1. ایجاد حساب در [Railway.app](https://railway.app)
2. اتصال GitHub repository
3. انتخاب پوشه `backend/`
4. تنظیم Environment Variables:
   - `PORT`: 3001
   - `NODE_ENV`: production
   - `SESSION_SECRET`: یک secret key قوی
   - `DATABASE_PATH`: `./database.db`

#### Render.com
1. ایجاد حساب در [Render.com](https://render.com)
2. ایجاد Web Service جدید
3. تنظیمات:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
   - Environment: Node

#### Heroku
```bash
heroku create your-app-name
git subtree push --prefix backend heroku main
```

### گزینه 2: استفاده از Cloud Database

برای استفاده از SQLite در Vercel، باید از یک cloud database استفاده کنید:

#### Supabase (PostgreSQL)
1. ایجاد حساب در [Supabase](https://supabase.com)
2. ایجاد پروژه جدید
3. استفاده از PostgreSQL به جای SQLite
4. به‌روزرسانی `backend/database.js` برای استفاده از PostgreSQL

#### PlanetScale (MySQL)
1. ایجاد حساب در [PlanetScale](https://planetscale.com)
2. ایجاد database جدید
3. به‌روزرسانی کد برای استفاده از MySQL

### گزینه 3: استفاده از Vercel Serverless Functions (محدود)

اگر می‌خواهید از Vercel استفاده کنید:

1. **Database را در `/tmp` قرار دهید** (فقط read-only):
   ```javascript
   // در backend/database.js
   const dbPath = process.env.DATABASE_PATH || '/tmp/database.db';
   ```

2. **Database را در build time کپی کنید**:
   ```json
   // در vercel.json
   {
     "buildCommand": "npm run build && cp backend/database.db /tmp/"
   }
   ```

3. **محدودیت**: فقط read-only operations کار می‌کنند

## تنظیمات Vercel

بعد از deploy بک‌اند در سرویس جداگانه:

1. در Vercel Dashboard → Settings → Environment Variables
2. اضافه کردن:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

## تست

برای تست بک‌اند:
```bash
curl https://your-backend-url.com/health
```

## نکات مهم

- برای production، حتماً از یک cloud database استفاده کنید
- SQLite فقط برای development مناسب است
- Session storage را به Redis یا database منتقل کنید
- File uploads را به S3 یا Cloudinary منتقل کنید

