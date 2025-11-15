# راهنمای دسترسی Public به سایت Local

این راهنما نحوه دسترسی به سایت از طریق IP محلی در شبکه را توضیح می‌دهد.

## 🚀 روش سریع

### 1. اجرای Frontend و Backend همزمان

```bash
npm run dev:full
```

این دستور هم frontend (port 8080) و هم backend (port 3001) را اجرا می‌کند.

### 2. پیدا کردن IP محلی

#### Windows (PowerShell):
```powershell
ipconfig | Select-String "IPv4"
```

یا:
```powershell
(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"}).IPAddress
```

#### Windows (CMD):
```cmd
ipconfig
```
به دنبال "IPv4 Address" بگردید (معمولاً چیزی مثل `192.168.x.x`)

#### Mac/Linux:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

یا:
```bash
hostname -I
```

### 3. دسترسی از دستگاه‌های دیگر

بعد از پیدا کردن IP (مثلاً `192.168.1.100`):

- **Frontend**: `http://192.168.1.100:8080`
- **Backend API**: `http://192.168.1.100:3001`

## 📱 دسترسی از موبایل

1. مطمئن شوید موبایل و کامپیوتر در همان WiFi هستند
2. در مرورگر موبایل وارد شوید:
   ```
   http://192.168.1.100:8080
   ```
3. اگر تصاویر نمایش داده نمی‌شوند، IP را در Environment Variable تنظیم کنید:
   ```bash
   # Windows PowerShell
   $env:VITE_API_URL="http://192.168.1.100:3001"
   npm run dev
   ```

## 🔧 تنظیمات پیشرفته

### اجرای جداگانه Frontend و Backend

#### Terminal 1 - Frontend:
```bash
npm run dev
```

#### Terminal 2 - Backend:
```bash
npm run server
```

### تغییر Port

#### Frontend (vite.config.ts):
```typescript
server: {
  host: "::",  // یا "0.0.0.0" برای همه interface ها
  port: 8080,  // می‌توانید تغییر دهید
}
```

#### Backend (backend/server.js):
```javascript
const PORT = process.env.PORT || 3001;  // می‌توانید تغییر دهید
```

### استفاده از Environment Variable برای IP

ایجاد فایل `.env.local`:
```env
VITE_API_URL=http://192.168.1.100:3001
```

سپس:
```bash
npm run dev
```

## 🔒 مشکلات امنیتی Firewall

اگر نمی‌توانید از دستگاه‌های دیگر دسترسی داشته باشید:

### Windows Firewall:
1. Windows Security → Firewall & network protection
2. Allow an app through firewall
3. Node.js را اضافه کنید یا port 8080 و 3001 را allow کنید

### دستور PowerShell (Run as Administrator):
```powershell
New-NetFirewallRule -DisplayName "Node.js Dev Server" -Direction Inbound -LocalPort 8080,3001 -Protocol TCP -Action Allow
```

## 🌐 استفاده از ngrok برای دسترسی از اینترنت

اگر می‌خواهید از اینترنت هم دسترسی داشته باشید:

1. نصب ngrok:
   ```bash
   npm install -g ngrok
   ```

2. اجرای ngrok:
   ```bash
   ngrok http 8080
   ```

3. استفاده از URL که ngrok می‌دهد (مثلاً `https://abc123.ngrok.io`)

## 📝 نکات مهم

- همیشه مطمئن شوید که firewall اجازه دسترسی می‌دهد
- IP محلی ممکن است تغییر کند (DHCP)
- برای production، از domain و HTTPS استفاده کنید
- در development، از `host: "::"` استفاده کنید تا از همه interface ها قابل دسترسی باشد

## 🐛 عیب‌یابی

### مشکل: نمی‌توانم از موبایل دسترسی داشته باشم
- مطمئن شوید که هر دو دستگاه در همان WiFi هستند
- Firewall را بررسی کنید
- IP را دوباره چک کنید

### مشکل: تصاویر نمایش داده نمی‌شوند
- IP backend را در `VITE_API_URL` تنظیم کنید
- مطمئن شوید backend در حال اجرا است

### مشکل: CORS Error
- Backend باید `cors` را allow کند (در حال حاضر allow است)
- مطمئن شوید که `origin: true` در backend تنظیم شده است

