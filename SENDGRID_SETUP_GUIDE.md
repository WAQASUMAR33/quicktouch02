# SendGrid Setup Guide - Quick & Easy

## ✅ SendGrid is Now Installed and Configured!

All email sending code has been switched to SendGrid.

---

## 🔑 Get Your SendGrid API Key (5 minutes)

### Step 1: Sign Up for SendGrid (Free)

1. Go to https://sendgrid.com/en-us/pricing
2. Click "Try for Free"
3. Fill in your details (use your email)
4. Verify your email
5. Complete sign up

**Free Plan Includes:**
- ✅ 100 emails/day (forever free)
- ✅ Email API
- ✅ Analytics
- ✅ Templates
- ✅ Perfect for your needs!

---

### Step 2: Create API Key

1. Login to SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name: "QuickTouch Academy"
5. Permissions: **Full Access** (or "Mail Send" only)
6. Click **Create & View**
7. **COPY the API key** (starts with `SG.`)
   
   ⚠️ **Important:** You can only see this once! Copy it now!

---

### Step 3: Verify Sender Email

SendGrid requires you to verify the "from" email address.

**Option A: Single Sender Verification (Easiest)**

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in:
   - From Name: QuickTouch Academy
   - From Email: **noreply@rapidtechpro.com**
   - Reply To: (same or your email)
   - Company Address: (your address)
4. Click **Create**
5. Check email inbox for verification link
6. Click the link to verify

**Option B: Domain Authentication** (Advanced, better for production)

1. Authenticate your entire domain (rapidtechpro.com)
2. Add DNS records (CNAME, TXT)
3. All emails from @rapidtechpro.com will be verified

---

### Step 4: Add API Key to Environment

#### Local Development (.env file):

Add this line to your `.env` file:
```env
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=noreply@rapidtechpro.com
```

#### Production (Vercel):

1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Add:
   - Name: `SENDGRID_API_KEY`
   - Value: `SG.your_actual_api_key_here`
   - Environment: Production
4. Add:
   - Name: `SENDGRID_FROM_EMAIL`
   - Value: `noreply@rapidtechpro.com`
   - Environment: Production
5. Save
6. Redeploy

---

## 🧪 Test SendGrid

### Local Test (After adding to .env):

```bash
# Visit in browser or use PowerShell
http://localhost:3000/api/test/send-email-sendgrid
```

**Or with PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/test/send-email-sendgrid"
```

### Production Test:

```
https://quicktouch02.vercel.app/api/test/send-email-sendgrid
```

---

## 📧 Expected Results

### Success Response:
```json
{
  "success": true,
  "message": "Test email sent successfully to theitxprts786@gmail.com via SendGrid",
  "details": {
    "statusCode": 202,
    "messageId": "abc123...",
    "recipient": "theitxprts786@gmail.com"
  }
}
```

### Email Received:
- **To:** theitxprts786@gmail.com
- **Subject:** ✅ SendGrid Test Email - QuickTouch Academy
- **Content:** Beautiful HTML email with success message
- **Delivery:** Within seconds!

---

## 🎯 What Happens After Setup

Once SendGrid is configured:

1. **Academy Registration:**
   - User signs up
   - Verification email sent via SendGrid ✅
   - Email delivered within seconds ✅
   - User clicks link ✅
   - Email verified ✅

2. **Password Reset:**
   - User requests reset
   - Email sent via SendGrid ✅
   - User clicks link ✅
   - Password reset ✅

3. **Resend Verification:**
   - User clicks resend
   - Email sent via SendGrid ✅
   - Works perfectly ✅

---

## 📊 SendGrid Dashboard

After sending emails, you can:
- View all sent emails
- See delivery status
- Check open rates
- View click rates
- Debug issues
- Monitor quotas

Go to: https://app.sendgrid.com/stats

---

## 🆘 Troubleshooting

### Issue: "SENDGRID_API_KEY is not set"
**Solution:** Add the API key to .env or Vercel environment variables

### Issue: "Sender email not verified"
**Solution:** 
1. Go to SendGrid → Settings → Sender Authentication
2. Verify noreply@rapidtechpro.com
3. Check email for verification link

### Issue: "Invalid API key"
**Solution:**
- Make sure you copied the full API key (starts with SG.)
- API key is case-sensitive
- No extra spaces before/after

### Issue: "403 Forbidden"
**Solution:**
- API key doesn't have Mail Send permission
- Create new API key with Full Access

---

## 💰 Cost

**Free Forever:**
- 100 emails/day
- Perfect for small to medium academies
- No credit card required
- Upgrade later if needed

**Paid Plans** (if you need more):
- $15/month = 40,000 emails
- $60/month = 100,000 emails

---

## ✅ Summary of Changes

**Code Updated:**
- ✅ Installed @sendgrid/mail package
- ✅ Created src/lib/emailSendGrid.js
- ✅ Updated registration API
- ✅ Updated resend verification API
- ✅ Updated forgot password API
- ✅ Created test endpoint

**What You Need:**
1. SendGrid account (free)
2. API key from SendGrid
3. Verify sender email (noreply@rapidtechpro.com)
4. Add API key to .env and Vercel
5. Test!

---

## 🚀 Quick Start

1. **Sign up:** https://sendgrid.com
2. **Get API key:** Settings → API Keys → Create
3. **Verify sender:** Settings → Sender Authentication
4. **Add to .env:** `SENDGRID_API_KEY=SG.xxx`
5. **Test:** http://localhost:3000/api/test/send-email-sendgrid
6. **Check inbox:** theitxprts786@gmail.com

**That's it! Email will work!** 📧✅

---

## Need Help?

Let me know when you:
1. Get your SendGrid API key
2. Verify your sender email
3. Add to .env

Then I'll help you test it! 🎉

