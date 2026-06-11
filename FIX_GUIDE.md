# 🔧 ShieldScan Error Fix Guide

## Issue 1: "AI Analysis Unavailable" + Anthropic Credit Error

### Error Message
```
Anthropic error: 400 {
  "type":"error",
  "error":{
    "type":"invalid_request_error",
    "message":"Your credit balance is too low to access the Anthropic API"
  }
}
```

### Root Cause
Your Anthropic API key has **expired free credits** or **insufficient balance**.

### SOLUTION (3 Steps)

#### Step 1: Check Your API Key Status
Go to https://console.anthropic.com/account/usage

#### Step 2: Add Payment & Credits
- Click **"Billing"** in left sidebar
- Add **Credit/Debit Card**
- Add at least **$5 USD** in credits
- Wait **2-3 minutes** for credits to activate

#### Step 3: Restart Application
```powershell
# Stop current server (Ctrl+C in terminal)
# Then restart:
npm run dev:full
```

### Verify It Works
Once restarted, scan a URL and check:
- ✅ **AI Threat Analysis** box shows actual analysis (not "Unavailable")
- ✅ **AI Confidence** bar shows percentage (e.g., "87%")
- ✅ **Threat Type** shows classification (phishing, malware, safe, etc.)

---

## Issue 2: DNS Records Not Displaying (FIXED)

### What Changed
✅ **Fixed** - DNS card now always displays, even if no records found
✅ Shows message: "No DNS records found (domain may not resolve)"

### Why It Happens
Some domains:
- Don't resolve (fake phishing domains)
- Use private WHOIS
- Have DNS blocking in place

### How to Verify DNS Works
Test with these URLs:
1. **https://www.google.com** → Should show A, MX, NS records
2. **http://malicious.tk** → May show "No DNS records" (intentionally fake)

---

## Complete Troubleshooting Checklist

### ☐ API Key Issues
- [ ] API key starts with `sk-ant-` (not `sk-test-`)
- [ ] No extra spaces/formatting in `.env`
- [ ] Credits > $0 in https://console.anthropic.com/account/usage
- [ ] Restarted server after updating key
- [ ] Server logs show `✓ Anthropic API key loaded (sk-ant-ap...)`

### ☐ Server Not Running
- [ ] Terminal shows `🛡 ShieldScan server running on http://localhost:5000`
- [ ] Browser can reach http://localhost:3000
- [ ] No error messages in terminal

### ☐ DNS/SSL/WHOIS Issues
- [ ] Scan shows "No threat indicators detected" (for safe URLs)
- [ ] SSL Details card shows "Valid: ✓ Yes"
- [ ] WHOIS card shows domain age or "WHOIS unavailable"
- [ ] DNS card now always displays (empty or with records)

### ☐ Network Issues
- [ ] Internet connection working
- [ ] Can reach https://google.com in browser
- [ ] No firewall blocking ports 5000 (API) or 3000 (frontend)

---

## Quick Test After Fixes

### Test 1: Verify API Key
Open terminal and run:
```bash
curl http://localhost:5000/api/health
```

Expected output:
```json
{
  "status": "ok",
  "anthropicKeyLoaded": true,
  "keyPreview": "sk-ant-..."
}
```

### Test 2: Scan Safe URL
```
URL: https://www.google.com
Expected: SAFE (0/100), SSL Valid ✓, Entropy 1.92
AI Analysis: Should show Claude's analysis (NOT "unavailable")
DNS Records: Should show A, MX, NS records
```

### Test 3: Scan Malicious URL
```
URL: http://paypal-verify.tk
Expected: HIGH/CRITICAL (60+/100)
AI Analysis: Should show threat classification
DNS Records: May show "No DNS records found"
```

---

## If Problems Persist

### Step 1: Stop Server
Press `Ctrl+C` in terminal

### Step 2: Clear Cache
```bash
# Delete node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### Step 3: Check .env File
```bash
# On Windows:
notepad .env

# Should contain:
ANTHROPIC_API_KEY=sk-ant-YOUR_ACTUAL_KEY_HERE
```

### Step 4: Restart
```bash
npm run dev:full
```

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "AI Analysis Unavailable" | No API key or credit expired | Add credits at console.anthropic.com |
| "Your credit balance is too low" | API key has $0 balance | Add payment method + $5+ credits |
| "Cannot find module 'docx'" | Incomplete npm install | Run `npm install` again |
| "Cannot connect to localhost:5000" | Backend not running | Check terminal for error, restart |
| "DNS Records" empty | Domain doesn't resolve | Normal for fake/phishing domains |
| "WHOIS unavailable" | Port 43 blocked | Expected in some networks (works on user's machine) |

---

## Support

If still having issues:
1. Check browser console for errors (F12)
2. Check terminal for server errors
3. Verify internet connection
4. Try different URL (test with google.com first)
5. Restart everything and try again

---

**Version**: 3.0 (May 2026)
**Last Updated**: 2026-05-30
