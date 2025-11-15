# 🚀 راهنمای کامل تنظیم ngrok

## مشکل شما: ngrok اجرا می‌شود اما هیچ اتفاقی نمی‌افتد

این معمولاً به این دلیل است که **authtoken** تنظیم نشده است.

## ✅ راه حل (3 مرحله)

### مرحله 1: ثبت‌نام و دریافت Token

1. به [ngrok.com/signup](https://dashboard.ngrok.com/signup) بروید
2. با GitHub یا Email ثبت‌نام کنید (رایگان است)
3. بعد از ورود، به این صفحه بروید:
   [https://dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
4. Token را کپی کنید (چیزی مثل: `2abc123def456ghi789jkl012mno345pq_6rst789uvw012xyz345`)

### مرحله 2: تنظیم Token

در Terminal اجرا کنید:
```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

مثلاً:
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl012mno345pq_6rst789uvw012xyz345
```

### مرحله 3: اجرای ngrok

**ابتدا سرور را اجرا کنید (Terminal 1):**
```bash
npm run dev
```

**سپس ngrok را اجرا کنید (Terminal 2):**
```bash
ngrok http 8080
```

## ✅ باید این را ببینید:

```
ngrok

Session Status                online
Account                       Your Name (Plan: Free)
Version                       x.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-def456.ngrok-free.app -> http://localhost:8080

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

## 📱 استفاده از URL

از URL که ngrok می‌دهد استفاده کنید:
```
https://abc123-def456.ngrok-free.app
```

این URL را می‌توانید از هر جایی (حتی اینترنت) استفاده کنید!

## 🔍 بررسی مشکلات

### اگر هنوز کار نمی‌کند:

1. **بررسی authtoken:**
   ```bash
   ngrok config check
   ```

2. **بررسی port:**
   ```bash
   netstat -ano | findstr :8080
   ```
   اگر خالی بود، یعنی `npm run dev` را اجرا نکرده‌اید.

3. **بررسی ngrok:**
   ```bash
   ngrok version
   ```

## 💡 نکات مهم

- **همیشه ابتدا سرور را اجرا کنید** (`npm run dev`) سپس ngrok
- URL ngrok در هر بار اجرا تغییر می‌کند (مگر plan پولی)
- برای استفاده دائمی، از Vercel استفاده کنید
- ngrok رایگان محدودیت دارد اما برای تست کافی است

## 🆓 جایگزین ngrok

اگر ngrok کار نکرد، می‌توانید از این استفاده کنید:

### localtunnel:
```bash
npm install -g localtunnel
lt --port 8080
```

### Cloudflare Tunnel (رایگان و نامحدود):
```bash
npm install -g cloudflared
cloudflared tunnel --url http://localhost:8080
```

