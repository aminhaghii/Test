# 🚀 راهنمای کامل Tunnel برای Frontend و Backend

## مشکل: Products و تصاویر نمایش داده نمی‌شوند

وقتی از ngrok یا tunnel استفاده می‌کنید، باید **هم Frontend و هم Backend** را tunnel کنید.

## ✅ راه حل کامل

### روش 1: Tunnel جداگانه برای Frontend و Backend

#### Terminal 1 - اجرای Frontend:
```bash
npm run dev
```

#### Terminal 2 - Tunnel برای Frontend:
```bash
npm run ngrok
```
یا:
```bash
ngrok http 8080
```

URL Frontend: `https://abc123.ngrok-free.app`

#### Terminal 3 - اجرای Backend:
```bash
npm run server
```

#### Terminal 4 - Tunnel برای Backend:
```bash
ngrok http 3001
```

URL Backend: `https://xyz789.ngrok-free.app`

#### تنظیم Environment Variable:

ایجاد فایل `.env.local` در root پروژه:
```env
VITE_API_URL=https://xyz789.ngrok-free.app
```

سپس Frontend را restart کنید (Terminal 1 را متوقف و دوباره اجرا کنید).

### روش 2: استفاده از localtunnel (ساده‌تر)

#### Terminal 1 - Frontend:
```bash
npm run dev
```

#### Terminal 2 - Tunnel Frontend:
```bash
npm run localtunnel
```

#### Terminal 3 - Backend:
```bash
npm run server
```

#### Terminal 4 - Tunnel Backend:
```bash
npm run localtunnel:backend
```

سپس در `.env.local`:
```env
VITE_API_URL=https://backend-url.loca.lt
```

## 🔧 تنظیمات سریع

### 1. ایجاد `.env.local`:

در root پروژه فایل `.env.local` ایجاد کنید:
```env
VITE_API_URL=http://localhost:3001
```

برای tunnel:
```env
VITE_API_URL=https://your-backend-tunnel-url.ngrok-free.app
```

### 2. Restart Frontend:

بعد از تغییر `.env.local`، Frontend را restart کنید:
```bash
# Ctrl+C برای متوقف کردن
npm run dev
```

## 📝 مراحل کامل (ngrok)

### 1. Terminal 1 - Frontend:
```bash
npm run dev
```

### 2. Terminal 2 - Tunnel Frontend:
```bash
ngrok http 8080
```
URL Frontend: `https://abc123.ngrok-free.app`

### 3. Terminal 3 - Backend:
```bash
npm run server
```

### 4. Terminal 4 - Tunnel Backend:
```bash
ngrok http 3001
```
URL Backend: `https://xyz789.ngrok-free.app`

### 5. تنظیم `.env.local`:
```env
VITE_API_URL=https://xyz789.ngrok-free.app
```

### 6. Restart Frontend (Terminal 1):
```bash
# Ctrl+C
npm run dev
```

## 🔍 بررسی مشکلات

### Products نمایش داده نمی‌شوند:
1. مطمئن شوید Backend در حال اجرا است (`npm run server`)
2. Backend را tunnel کنید
3. `VITE_API_URL` را در `.env.local` تنظیم کنید
4. Frontend را restart کنید

### تصاویر نمایش داده نمی‌شوند:
1. تصاویر باید از `public` folder سرو شوند (درست است)
2. اگر از backend سرو می‌شوند، backend را tunnel کنید
3. مطمئن شوید که `getImageUrl()` استفاده می‌شود

## 💡 نکات مهم

- **همیشه Backend را هم tunnel کنید** اگر از tunnel استفاده می‌کنید
- بعد از تغییر `.env.local`، Frontend را restart کنید
- URL های tunnel در هر بار اجرا تغییر می‌کنند
- برای production، از Vercel استفاده کنید

## 🆓 استفاده از localtunnel (توصیه می‌شود)

localtunnel ساده‌تر است:

```bash
# Terminal 1
npm run dev

# Terminal 2  
npm run localtunnel

# Terminal 3
npm run server

# Terminal 4
npm run localtunnel:backend
```

سپس در `.env.local`:
```env
VITE_API_URL=https://backend-url.loca.lt
```

