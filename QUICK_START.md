# 🚀 راهنمای سریع اجرای Local Public

## روش ساده (3 مرحله)

### 1️⃣ نمایش IP محلی
```bash
npm run show-ip
```

این دستور IP شما را نشان می‌دهد (مثلاً `192.168.100.3`)

### 2️⃣ اجرای Frontend و Backend
```bash
npm run dev:full
```

این دستور هم frontend (port 8080) و هم backend (port 3001) را اجرا می‌کند.

### 3️⃣ دسترسی از دستگاه‌های دیگر

بعد از اجرای دستورات بالا، از هر دستگاهی در همان شبکه WiFi:

- **Frontend**: `http://192.168.100.3:8080`
- **Backend API**: `http://192.168.100.3:3001`

## 📱 دسترسی از موبایل

1. مطمئن شوید موبایل و کامپیوتر در همان WiFi هستند
2. در مرورگر موبایل وارد شوید:
   ```
   http://192.168.100.3:8080
   ```

## ⚠️ اگر تصاویر نمایش داده نمی‌شوند

IP backend را در Environment Variable تنظیم کنید:

**Windows PowerShell:**
```powershell
$env:VITE_API_URL="http://192.168.100.3:3001"
npm run dev
```

**Windows CMD:**
```cmd
set VITE_API_URL=http://192.168.100.3:3001
npm run dev
```

**Mac/Linux:**
```bash
export VITE_API_URL=http://192.168.100.3:3001
npm run dev
```

یا فایل `.env.local` ایجاد کنید:
```env
VITE_API_URL=http://192.168.100.3:3001
```

## 🔥 مشکلات رایج

### Firewall مسدود می‌کند
**Windows PowerShell (Run as Administrator):**
```powershell
New-NetFirewallRule -DisplayName "Node.js Dev" -Direction Inbound -LocalPort 8080,3001 -Protocol TCP -Action Allow
```

### IP تغییر می‌کند
هر بار که IP تغییر کرد، دوباره `npm run show-ip` را اجرا کنید.

## 📚 راهنمای کامل

برای اطلاعات بیشتر، فایل `docs/LOCAL_PUBLIC_ACCESS.md` را مطالعه کنید.

