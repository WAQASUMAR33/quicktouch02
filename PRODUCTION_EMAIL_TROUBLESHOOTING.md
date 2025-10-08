# Production Email Troubleshooting Guide

## Issue: Verification Emails Not Being Sent in Production

### How to Debug

#### Step 1: Check Vercel Environment Variables

Go to your Vercel project settings and verify these variables are set:

```
EMAIL_SERVER_HOST=smtp.hostinger.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=noreply@rapidtechpro.com
EMAIL_SERVER_PASSWORD=DildilPakistan786@786@waqas
EMAIL_FROM=noreply@rapidtechpro.com
NEXT_PUBLIC_APP_URL=https://quicktouch02.vercel.app
JWT_SECRET=your_secret_key_here
```

⚠️ **Important:** Make sure there are NO quotes around values in Vercel dashboard.

#### Step 2: Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Functions** or **Logs** tab
4. Look for logs when someone registers

**Look for these logs:**

✅ **If configuration is correct:**
```
📧 Email Configuration:
  Host: smtp.hostinger.com
  Port: 587
  User: noreply@rapidtechpro.com
  From: noreply@rapidtechpro.com

🔄 Attempting to send verification email...
   To: newacademy@example.com
   Academy: New Academy Name
   
📤 Sending verification email to: newacademy@example.com
   Verification token: abc123...
   Verification URL: https://quicktouch02.vercel.app/academy/verify-email?token=abc123

✅ Verification email sent successfully!
   Message ID: <123@smtp.hostinger.com>
```

❌ **If configuration is missing:**
```
❌ Missing email configuration: EMAIL_SERVER_PORT, EMAIL_SERVER_PASSWORD
```

❌ **If SMTP fails:**
```
❌ Error sending verification email:
   Error code: EAUTH
   Error message: Invalid login
   SMTP Response: 535 Authentication failed
```

#### Step 3: Test Registration

Register a new test academy in production:
```
1. Go to: https://quicktouch02.vercel.app/academy/signup
2. Fill in details with YOUR email (so you can check inbox)
3. Submit form
4. Check your email inbox
5. Check Vercel logs
```

#### Step 4: Common Issues and Solutions

##### Issue 1: "Missing email configuration"
**Solution:** Add missing variables to Vercel environment variables

##### Issue 2: "Authentication failed (535)"
**Solution:** 
- Verify EMAIL_SERVER_USER is correct
- Verify EMAIL_SERVER_PASSWORD is correct
- Check if password has special characters that need escaping
- Try removing @ symbols or encoding them

##### Issue 3: "Connection timeout"
**Solution:**
- Vercel might block port 587
- Try port 465 (secure SMTP)
- Contact Hostinger support
- Consider using SendGrid/Mailgun instead

##### Issue 4: "nodemailer.createTransporter is not a function"
**Solution:**
- This shouldn't happen in production
- If it does, check build logs
- Verify nodemailer is in dependencies (not devDependencies)

---

## Alternative: Use SendGrid (Recommended for Production)

If Hostinger SMTP doesn't work in Vercel, use SendGrid:

### Step 1: Install SendGrid
```bash
npm install @sendgrid/mail
```

### Step 2: Create SendGrid Account
1. Sign up at https://sendgrid.com
2. Get API key
3. Verify sender email

### Step 3: Update Environment
```
SENDGRID_API_KEY=your_api_key_here
```

### Step 4: Update Email Service
Create `src/lib/emailSendGrid.js` with SendGrid implementation

---

## Current Behavior (Working as Designed)

### ✅ What Works Now:

1. **Registration:**
   - Academy can signup ✅
   - Account created in database ✅
   - Redirect to login page ✅
   - Success message shown ✅

2. **Login:**
   - Can login immediately ✅
   - No email verification required ✅
   - Warning shows if not verified ✅
   - Resend button available ✅

3. **Verification:**
   - API endpoints ready ✅
   - UI components ready ✅
   - Token system working ✅
   - Waiting for SMTP config ✅

### ⚠️ What Needs Configuration:

- Email sending (needs Vercel env vars)

---

## Quick Check in Production

### Test if environment variables are set:

Create a test API endpoint to check config (development only):

```javascript
// /api/test/check-email-config
export async function GET() {
  return NextResponse.json({
    host: process.env.EMAIL_SERVER_HOST || 'not set',
    port: process.env.EMAIL_SERVER_PORT || 'not set',
    user: process.env.EMAIL_SERVER_USER || 'not set',
    password: process.env.EMAIL_SERVER_PASSWORD ? 'set' : 'not set',
    from: process.env.EMAIL_FROM || 'not set',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'not set'
  });
}
```

Access: https://quicktouch02.vercel.app/api/test/check-email-config

---

## Vercel Environment Variables Setup

### How to Add in Vercel Dashboard:

1. Go to https://vercel.com
2. Select your project (quicktouch02)
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| EMAIL_SERVER_HOST | smtp.hostinger.com | Production |
| EMAIL_SERVER_PORT | 587 | Production |
| EMAIL_SERVER_USER | noreply@rapidtechpro.com | Production |
| EMAIL_SERVER_PASSWORD | DildilPakistan786@786@waqas | Production |
| EMAIL_FROM | noreply@rapidtechpro.com | Production |
| NEXT_PUBLIC_APP_URL | https://quicktouch02.vercel.app | Production |
| JWT_SECRET | your_secret_key | Production |

5. Click **Save**
6. **Redeploy** your application (trigger a new deployment)

---

## Testing After Configuration

### Test 1: Register New Academy
```
1. Go to production signup page
2. Use YOUR email address
3. Submit registration
4. Check Vercel logs
5. Check your email inbox
```

### Test 2: Resend Verification
```
1. Login with unverified account
2. See yellow warning
3. Click "Resend Verification Email"
4. Check Vercel logs
5. Check email inbox
```

### Test 3: Verify Email
```
1. Open verification email
2. Click verification link
3. Should see success message
4. Login again
5. No warning should appear
```

---

## Expected Signup Flow (After Fix)

```
1. User fills signup form
   ↓
2. Submit → POST /api/auth/academy/register
   ↓
3. Account created in database ✅
   ↓
4. Verification token generated ✅
   ↓
5. Email sent via SMTP ✅
   ↓
6. Success alert shown ✅
   ↓
7. Redirect to login page ✅
   ↓
8. User checks email ✅
   ↓
9. Clicks verification link ✅
   ↓
10. Email verified ✅
   ↓
11. User logs in ✅
   ↓
12. No warning (verified) ✅
```

---

## Server Logs to Monitor

When email is sent successfully:
```
📧 Email Configuration:
  Host: smtp.hostinger.com
  Port: 587
  User: noreply@rapidtechpro.com
  From: noreply@rapidtechpro.com

🔄 Attempting to send verification email...
   To: academy@example.com
   Academy: Academy Name

📤 Sending verification email to: academy@example.com
   Verification token: 1a2b3c...
   Verification URL: https://quicktouch02.vercel.app/academy/verify-email?token=1a2b3c

✅ Verification email sent successfully!
   Message ID: <123@smtp.hostinger.com>
   Response: 250 OK
```

When email fails:
```
❌ Missing email configuration: EMAIL_SERVER_PORT, EMAIL_SERVER_PASSWORD
OR
❌ Error sending verification email:
   Error code: EAUTH
   Error message: Invalid login: 535 Authentication credentials invalid
```

---

## Summary

### Current Status:
- ✅ Signup works
- ✅ Redirects to login (not dashboard)
- ✅ Login works without verification (by design)
- ✅ Verification UI works
- ✅ Resend button works
- ❌ Emails not sent (missing Vercel env vars)

### To Fix:
1. Add all EMAIL_* variables to Vercel
2. Add JWT_SECRET to Vercel
3. Add NEXT_PUBLIC_APP_URL to Vercel
4. Redeploy
5. Check logs
6. Test with your email

### Expected Result:
- Emails will be sent ✅
- You'll receive verification links ✅
- Clicking link will verify email ✅
- Login will show no warning ✅

---

**The code is ready - just needs environment variables configured in Vercel!** 🚀

