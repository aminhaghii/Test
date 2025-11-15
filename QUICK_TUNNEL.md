# 🚀 راهنمای سریع Tunnel (جایگزین ngrok)

## ⚠️ مشکل ngrok: IP شما block شده است

اگر ngrok کار نمی‌کند، از این روش‌ها استفاده کنید:

## 🆓 روش 1: localtunnel (ساده‌ترین)

### نصب:
```bash
npm install -g localtunnel
```

### استفاده:

**Terminal 1 - اجرای Frontend:**
```bash
npm run dev
```

**Terminal 2 - اجرای Tunnel:**
```bash
npm run localtunnel
```

یا:
```bash
lt --port 8080
```

یک URL مثل این نمایش داده می‌شود:
```
your url is: https://abc123.loca.lt
```

## 🆓 روش 2: Cloudflare Tunnel (بهترین)

### نصب:
```bash
npm install -g cloudflared
```

### استفاده:

**Terminal 1 - اجرای Frontend:**
```bash
npm run dev
```

**Terminal 2 - اجرای Tunnel:**
```bash
npm run tunnel
```

یا:
```bash
cloudflared tunnel --url http://localhost:8080
```

## 📱 استفاده از URL

بعد از اجرای tunnel، URL را در مرورگر موبایل یا هر دستگاه دیگری باز کنید.

## 🔄 برای Backend هم

اگر می‌خواهید Backend را هم tunnel کنید:

**Terminal 3 - اجرای Backend:**
```bash
npm run server
```

**Terminal 4 - Tunnel برای Backend:**
```bash
npm run localtunnel:backend
```

سپس در `.env.local`:
```env
VITE_API_URL=https://backend-url.loca.lt
```

## 💡 توصیه

**localtunnel** ساده‌ترین و سریع‌ترین روش است. فقط نیاز به یک نصب دارد:
```bash
npm install -g localtunnel
```

سپس:
```bash
npm run localtunnel
```

## 🌐 برای Production

برای استفاده دائمی، از **Vercel** استفاده کنید که:
- ✅ رایگان است
- ✅ محدودیت IP ندارد
- ✅ HTTPS خودکار
- ✅ CDN و caching

