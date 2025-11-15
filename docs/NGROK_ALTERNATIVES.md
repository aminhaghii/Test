# جایگزین‌های ngrok (رایگان و بدون محدودیت IP)

## ⚠️ مشکل: ngrok IP شما را block کرده

اگر ngrok خطای `ERR_NGROK_9040` می‌دهد، می‌توانید از این جایگزین‌ها استفاده کنید:

## 🆓 1. Cloudflare Tunnel (توصیه می‌شود)

### نصب:
```bash
npm install -g cloudflared
```

### استفاده:
```bash
cloudflared tunnel --url http://localhost:8080
```

**مزایا:**
- ✅ رایگان و نامحدود
- ✅ بدون نیاز به ثبت‌نام
- ✅ سریع و قابل اعتماد
- ✅ HTTPS خودکار

## 🆓 2. localtunnel

### نصب:
```bash
npm install -g localtunnel
```

### استفاده:
```bash
lt --port 8080
```

**مزایا:**
- ✅ رایگان
- ✅ بدون نیاز به ثبت‌نام
- ✅ ساده و سریع

## 🆓 3. serveo.net

### استفاده (بدون نصب):
```bash
ssh -R 80:localhost:8080 serveo.net
```

**مزایا:**
- ✅ بدون نیاز به نصب
- ✅ رایگان
- ✅ فقط نیاز به SSH دارد

## 🆓 4. localhost.run

### استفاده (بدون نصب):
```bash
ssh -R 80:localhost:8080 ssh.localhost.run
```

## 📝 راهنمای استفاده با این پروژه

### برای Frontend:

**Terminal 1 - اجرای Frontend:**
```bash
npm run dev
```

**Terminal 2 - اجرای Tunnel:**

**با Cloudflare:**
```bash
cloudflared tunnel --url http://localhost:8080
```

**با localtunnel:**
```bash
lt --port 8080
```

### برای Backend:

**Terminal 3 - اجرای Backend:**
```bash
npm run server
```

**Terminal 4 - اجرای Tunnel برای Backend:**
```bash
cloudflared tunnel --url http://localhost:3001
```

سپس در `.env.local`:
```env
VITE_API_URL=https://backend-tunnel-url.trycloudflare.com
```

## 🔧 اضافه کردن به package.json

می‌توانید این scripts را اضافه کنید:

```json
{
  "scripts": {
    "tunnel": "cloudflared tunnel --url http://localhost:8080",
    "tunnel:backend": "cloudflared tunnel --url http://localhost:3001"
  }
}
```

## 💡 توصیه

برای استفاده دائمی و production، از **Vercel** استفاده کنید که رایگان است و محدودیت IP ندارد.

