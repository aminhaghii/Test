# 🔧 رفع سریع مشکل ngrok

## مشکل: ngrok اجرا می‌شود اما هیچ اتفاقی نمی‌افتد

### ✅ راه حل 1: تنظیم Authtoken

ngrok نیاز به authtoken دارد. مراحل:

1. **ثبت‌نام در ngrok:**
   - به [ngrok.com/signup](https://dashboard.ngrok.com/signup) بروید
   - ثبت‌نام کنید (رایگان است)

2. **دریافت Token:**
   - بعد از ورود، به [Your Authtoken](https://dashboard.ngrok.com/get-started/your-authtoken) بروید
   - Token را کپی کنید

3. **تنظیم Token:**
   ```bash
   ngrok config add-authtoken YOUR_TOKEN_HERE
   ```

### ✅ راه حل 2: مطمئن شوید سرور در حال اجرا است

**قبل از اجرای ngrok، ابتدا سرور را اجرا کنید:**

**Terminal 1:**
```bash
npm run dev
```

یا:
```bash
npm run dev:full
```

**سپس Terminal 2:**
```bash
ngrok http 8080
```

### ✅ راه حل 3: استفاده از npm script

بجای دستور مستقیم ngrok، از script استفاده کنید:

```bash
npm run ngrok
```

این script ابتدا بررسی می‌کند که port در حال اجرا است یا نه.

## 🔍 بررسی مشکلات

### بررسی نصب ngrok:
```bash
ngrok version
```

### بررسی authtoken:
```bash
ngrok config check
```

### بررسی port:
```bash
netstat -ano | findstr :8080
```

اگر خالی بود، یعنی سرور در حال اجرا نیست.

## 📝 دستورات کامل (مرحله به مرحله)

### 1. Terminal 1 - اجرای Frontend:
```bash
npm run dev
```

صبر کنید تا ببینید:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:8080/
➜  Network: http://192.168.x.x:8080/
```

### 2. Terminal 2 - اجرای ngrok:
```bash
ngrok http 8080
```

باید ببینید:
```
Session Status                online
Account                       Your Name
Forwarding                    https://xxxx-xxxx.ngrok-free.app -> http://localhost:8080
```

### 3. استفاده از URL:
از URL که ngrok می‌دهد استفاده کنید (مثلاً `https://xxxx-xxxx.ngrok-free.app`)

## ⚠️ اگر هنوز کار نمی‌کند

1. **بررسی Firewall:**
   ```powershell
   # Run as Administrator
   New-NetFirewallRule -DisplayName "ngrok" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
   ```

2. **بررسی Antivirus:**
   - ممکن است antivirus ngrok را block کند
   - ngrok را به exception list اضافه کنید

3. **استفاده از port دیگر:**
   ```bash
   ngrok http 3000
   ```

4. **بررسی log های ngrok:**
   - در terminal که ngrok را اجرا کردید، خطاها را بررسی کنید

## 🆓 جایگزین ngrok (اگر کار نکرد)

### استفاده از localtunnel:
```bash
npm install -g localtunnel
lt --port 8080
```

### استفاده از serveo:
```bash
ssh -R 80:localhost:8080 serveo.net
```

