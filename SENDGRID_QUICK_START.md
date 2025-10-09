# SendGrid Quick Start - Do This Now!

## 🚀 5-Minute Setup

### ✅ Step 1: Sign Up (2 minutes)

Go to: **https://sendgrid.com/en-us/pricing**

- Click "**Try for Free**"
- Enter your email (theitxprts786@gmail.com or any email)
- Create password
- Fill in business details (any info is fine)
- Verify your email
- Complete signup

---

### ✅ Step 2: Get API Key (1 minute)

1. Login to SendGrid dashboard
2. Click **Settings** (left sidebar)
3. Click **API Keys**
4. Click **Create API Key** (blue button)
5. Name: `QuickTouch Academy`
6. Permissions: Select **Full Access**
7. Click **Create & View**
8. **COPY THE API KEY** (starts with `SG.`)

⚠️ **IMPORTANT:** You can only see this key ONCE! Copy it now!

Example: `SG.abc123xyz456...` (around 69 characters)

---

### ✅ Step 3: Verify Sender Email (2 minutes)

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender** button
3. Fill the form:
   ```
   From Name: QuickTouch Academy
   From Email Address: noreply@rapidtechpro.com
   Reply To: noreply@rapidtechpro.com
   Company: QuickTouch
   Address: 123 Main St
   City: Your City
   Country: Your Country
   ```
4. Click **Create**
5. Check the inbox of **noreply@rapidtechpro.com**
6. Click the verification link in email
7. Done!

---

### ✅ Step 4: Add to .env File

Open your `.env` file and add these lines:

```env
SENDGRID_API_KEY=SG.paste_your_actual_api_key_here
SENDGRID_FROM_EMAIL=noreply@rapidtechpro.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=quicktouch_secret_key_2025
```

Save the file.

---

### ✅ Step 5: Test Email Sending

**Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

**Run test:**
```bash
node test-sendgrid.js
```

**Expected output:**
```
✅ SUCCESS! Email sent via SendGrid!
📬 Check your inbox at theitxprts786@gmail.com!
```

**Check your email** - should arrive within seconds!

---

## 🎯 Quick Reference

| What | Where | Value |
|------|-------|-------|
| Sign Up | https://sendgrid.com | Free account |
| Get API Key | Settings → API Keys | Starts with SG. |
| Verify Sender | Settings → Sender Auth | noreply@rapidtechpro.com |
| Test Endpoint | /api/test/send-email-sendgrid | Local or production |

---

## ✅ After Setup

Once you have the API key:

1. Add to `.env` file
2. Add to Vercel environment variables
3. Run: `node test-sendgrid.js`
4. Check inbox
5. ✅ Email working!

Then all these will work:
- ✅ Account verification emails
- ✅ Password reset emails
- ✅ Resend verification
- ✅ All email features

---

## 📞 Need Help?

If you get stuck:
1. Make sure you verified the sender email
2. Check API key is copied correctly (no spaces)
3. Restart dev server after adding to .env
4. Check SendGrid dashboard for error messages

---

**Get your SendGrid API key now and we'll test it immediately!** 🚀

The key starts with `SG.` and is about 69 characters long.

