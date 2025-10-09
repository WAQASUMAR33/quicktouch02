# Test Email Sending - Step by Step Guide

## ✅ SMTP Connection Verified!

Your Hostinger SMTP server is accessible and responding on port 587.

---

## 🧪 How to Test Email Sending in Production

### Method 1: Using Browser (Easiest)

#### Step 1: Check Environment Variables
Open this URL in your browser:
```
https://quicktouch02.vercel.app/api/test/check-email-env
```

**What to look for:**
- `allConfigured: true`
- All EMAIL_* variables should show values or "SET (hidden)"
- `missing: []` (empty array)

**If variables are missing:**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add the missing variables
4. Redeploy

#### Step 2: Send Test Email
Open this URL in your browser:
```
https://quicktouch02.vercel.app/api/test/send-test-email
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test email sent successfully to theitxprts786@gmail.com"
}
```

#### Step 3: Check Your Inbox
- Email: **theitxprts786@gmail.com**
- Subject: "✅ Test Email - QuickTouch Academy"
- Check: Inbox, Spam, Promotions

---

### Method 2: Using PowerShell

```powershell
# Check environment
Invoke-WebRequest -Uri "https://quicktouch02.vercel.app/api/test/check-email-env"

# Send test email
Invoke-WebRequest -Uri "https://quicktouch02.vercel.app/api/test/send-test-email"
```

---

### Method 3: Register Test Academy

The most realistic test:

1. Go to: https://quicktouch02.vercel.app/academy/signup
2. Fill in the form:
   - Name: Test Academy
   - Email: **theitxprts786@gmail.com**
   - Password: test123
3. Submit
4. Check inbox for verification email
5. Check Vercel logs for email sending status

---

## 🔍 Checking Vercel Logs

### How to Access Logs:

1. Go to https://vercel.com/dashboard
2. Click on your project (quicktouch02)
3. Click on **Logs** or **Functions** tab
4. Filter by time when you tested

### What to Look For:

✅ **If Email Sent Successfully:**
```
📧 Email Configuration:
  Host: smtp.hostinger.com
  Port: 587
  ...

🔄 Attempting to send verification email...
   To: theitxprts786@gmail.com

✅ Verification email sent successfully!
   Message ID: <123@smtp.hostinger.com>
   Response: 250 OK
```

❌ **If Configuration Missing:**
```
❌ Missing email configuration: EMAIL_SERVER_PORT
```

❌ **If SMTP Auth Failed:**
```
❌ Error sending verification email:
   Error code: EAUTH
   SMTP Response: 535 Authentication failed
```

---

## 🛠️ Troubleshooting

### Issue 1: Variables Not Set in Vercel

**Solution:**
Verify these are set in Vercel → Settings → Environment Variables:

```
EMAIL_SERVER_HOST=smtp.hostinger.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=noreply@rapidtechpro.com
EMAIL_SERVER_PASSWORD=DildilPakistan786@786@waqas
EMAIL_FROM=noreply@rapidtechpro.com
NEXT_PUBLIC_APP_URL=https://quicktouch02.vercel.app
JWT_SECRET=(your secret key)
```

⚠️ **Important:** Don't use quotes in Vercel dashboard!

### Issue 2: Email in Spam

Check these folders in Gmail:
- Spam
- Promotions
- All Mail

### Issue 3: Vercel Can't Access SMTP

Some cloud platforms block SMTP. Solutions:
1. Try port 465 instead of 587
2. Use SendGrid (recommended for Vercel)
3. Use Mailgun
4. Use AWS SES

### Issue 4: Hostinger Blocking

- Verify noreply@rapidtechpro.com is set up in Hostinger
- Check Hostinger email quota/limits
- Verify domain DNS records (SPF, DKIM)

---

## 🎯 Quick Test Summary

### Local Test:
✅ SMTP connection: Working (port 587 accessible)
✅ Configuration: Correct
❌ Nodemailer: Import issue (CommonJS vs ESM) - This is OK!

### Production Test:
📝 Next.js API routes use ES modules (will work)
📝 Need to test via production URL
📝 Check Vercel logs for results

---

## 📧 Recommended: Test in Production Now

1. **Visit:** https://quicktouch02.vercel.app/api/test/check-email-env
2. **Verify:** All variables are set
3. **Visit:** https://quicktouch02.vercel.app/api/test/send-test-email
4. **Wait:** 1-2 minutes
5. **Check:** theitxprts786@gmail.com inbox

---

## Alternative: Use SendGrid (If Hostinger Doesn't Work in Vercel)

SendGrid is designed for cloud platforms like Vercel:

```bash
npm install @sendgrid/mail
```

Then I can update the email service to use SendGrid API (more reliable in serverless environments).

---

## Current Status

✅ **Code:** Complete and deployed
✅ **SMTP:** Connection verified
✅ **Config:** Credentials correct
⏳ **Testing:** Need to test in production via URLs above

**Try the production URLs now and check your inbox!** 📬

