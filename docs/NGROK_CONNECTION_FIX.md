# 🔧 رفع مشکل اتصال ngrok

## مشکل: "failed to dial ngrok server" یا "reconnecting"

این مشکل معمولاً به دلایل زیر است:

## ✅ راه حل 1: بررسی Firewall و Antivirus

### Windows Firewall:
1. Windows Security → Firewall & network protection
2. Allow an app through firewall
3. ngrok.exe را اضافه کنید

**یا از PowerShell (Run as Administrator):**
```powershell
New-NetFirewallRule -DisplayName "ngrok" -Direction Outbound -Program "C:\Users\aminh\AppData\Roaming\npm\node_modules\ngrok\bin\ngrok.exe" -Action Allow
```

### Antivirus:
- ngrok را به exception list اضافه کنید
- ممکن است antivirus ngrok را block کند

## ✅ راه حل 2: استفاده از VPN

اگر IP شما block شده است:
1. VPN را روشن کنید
2. ngrok را دوباره اجرا کنید

## ✅ راه حل 3: تغییر Region

```bash
ngrok http 8080 --region us
```

یا:
```bash
ngrok http 8080 --region eu
```

یا:
```bash
ngrok http 8080 --region ap
```

## ✅ راه حل 4: استفاده از جایگزین (توصیه می‌شود)

### localtunnel (ساده‌ترین):

**نصب:**
```bash
npm install -g localtunnel
```

**استفاده:**
```bash
npm run localtunnel
```

### Cloudflare Tunnel:

**نصب:**
```bash
npm install -g cloudflared
```

**استفاده:**
```bash
npm run tunnel
```

## ✅ راه حل 5: بررسی Proxy Settings

اگر از proxy استفاده می‌کنید:

```bash
ngrok http 8080 --proxy http://proxy-server:port
```

## 🔍 عیب‌یابی

### بررسی اتصال:
```bash
ping connect.ngrok-agent.com
```

### بررسی DNS:
```bash
nslookup connect.ngrok-agent.com
```

### تست با curl:
```bash
curl https://connect.ngrok-agent.com
```

## 💡 توصیه

اگر ngrok مدام مشکل دارد، از **localtunnel** استفاده کنید که:
- ✅ بدون نیاز به ثبت‌نام
- ✅ بدون محدودیت IP
- ✅ ساده‌تر
- ✅ رایگان

**نصب و استفاده:**
```bash
npm install -g localtunnel
npm run localtunnel
```

