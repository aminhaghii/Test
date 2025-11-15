# راهنمای نصب و استفاده از ngrok

## 📦 نصب ngrok

### روش 1: دانلود مستقیم (توصیه می‌شود)

1. به [ngrok.com](https://ngrok.com/download) بروید
2. برای Windows دانلود کنید
3. فایل `ngrok.exe` را در یک پوشه (مثلاً `C:\ngrok`) قرار دهید
4. پوشه را به PATH اضافه کنید:
   - Windows Settings → System → About → Advanced system settings
   - Environment Variables → System variables → Path → Edit
   - New → `C:\ngrok` → OK

### روش 2: استفاده از Chocolatey

```powershell
choco install ngrok
```

### روش 3: استفاده از Scoop

```powershell
scoop install ngrok
```

### روش 4: استفاده از npm (برای این پروژه)

```bash
npm install -g ngrok
```

## 🔑 ثبت‌نام و دریافت Token

1. به [ngrok.com](https://dashboard.ngrok.com/signup) بروید و ثبت‌نام کنید
2. بعد از ورود، به [Your Authtoken](https://dashboard.ngrok.com/get-started/your-authtoken) بروید
3. Token را کپی کنید
4. در Terminal اجرا کنید:
   ```bash
   ngrok config add-authtoken YOUR_TOKEN_HERE
   ```

## 🚀 استفاده از ngrok

### مرحله 1: اجرای Frontend

در Terminal اول:
```bash
npm run dev
```

یا برای اجرای همزمان Frontend و Backend:
```bash
npm run dev:full
```

### مرحله 2: اجرای ngrok

در Terminal جدید:
```bash
ngrok http 8080
```

### مرحله 3: استفاده از URL

بعد از اجرای ngrok، یک URL مثل این نمایش داده می‌شود:
```
Forwarding   https://abc123-def456.ngrok-free.app -> http://localhost:8080
```

از این URL در هر جایی (حتی اینترنت) می‌توانید استفاده کنید.

## ⚠️ مشکلات رایج

### مشکل: "command not found" یا "ngrok is not recognized"

**راه حل:**
- مطمئن شوید ngrok نصب است
- PATH را بررسی کنید
- Terminal را restart کنید

### مشکل: "ERR_NGROK_108" یا "authtoken required"

**راه حل:**
```bash
ngrok config add-authtoken YOUR_TOKEN
```

### مشکل: "port 8080 is not running"

**راه حل:**
- ابتدا `npm run dev` را اجرا کنید
- مطمئن شوید که سرور در حال اجرا است
- سپس ngrok را اجرا کنید

### مشکل: ngrok اجرا می‌شود اما سایت باز نمی‌شود

**راه حل:**
- مطمئن شوید که `vite.config.ts` دارای `host: "::"` است
- Firewall را بررسی کنید
- Port 8080 را در Firewall allow کنید

## 🔄 استفاده از ngrok با Backend

اگر می‌خواهید هم Frontend و هم Backend را از طریق ngrok در دسترس قرار دهید:

### روش 1: دو ngrok instance

**Terminal 1 - Frontend:**
```bash
npm run dev
ngrok http 8080
```

**Terminal 2 - Backend:**
```bash
npm run server
ngrok http 3001
```

سپس در `.env.local`:
```env
VITE_API_URL=https://backend-ngrok-url.ngrok-free.app
```

### روش 2: استفاده از ngrok config file

ایجاد فایل `ngrok.yml`:
```yaml
version: "2"
authtoken: YOUR_TOKEN
tunnels:
  frontend:
    addr: 8080
    proto: http
  backend:
    addr: 3001
    proto: http
```

سپس:
```bash
ngrok start --all
```

## 📝 نکات مهم

- URL ngrok در هر بار اجرا تغییر می‌کند (مگر اینکه از plan پولی استفاده کنید)
- برای production، از domain و HTTPS استفاده کنید
- ngrok رایگان محدودیت دارد (مثلاً تعداد request)
- برای استفاده دائمی، از Vercel یا سرویس‌های مشابه استفاده کنید

## 🆓 جایگزین‌های رایگان ngrok

1. **Cloudflare Tunnel** (رایگان و نامحدود)
2. **localtunnel** (npm install -g localtunnel)
3. **serveo.net** (بدون نصب)

