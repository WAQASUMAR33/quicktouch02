# Academy Portal Test Credentials

## 🔐 Login Information

Use these credentials to access the Academy Portal at:
- **Local:** http://localhost:3000/academy/login
- **Production:** https://quicktouch02.vercel.app/academy/login

---

## 👥 Test User Accounts

### 1️⃣ Coach Account
```
Email: coach@academy.com
Password: password123
Role: coach
Full Name: Coach John Smith
```

**Access:**
- Academy Dashboard
- Training Plans Management
- Player Management
- Feedback System
- Events Calendar

---

### 2️⃣ Player Account
```
Email: player@academy.com
Password: password123
Role: player
Full Name: Player Mike Johnson
```

**Player Profile:**
- Age: 18
- Height: 180 cm
- Weight: 75 kg
- Position: Midfielder
- Preferred Foot: Right

**Access:**
- Academy Dashboard
- Personal Profile
- Video Uploads (Reels)
- Training Stats
- Events Calendar

---

### 3️⃣ Scout Account
```
Email: scout@academy.com
Password: password123
Role: scout
Full Name: Scout Sarah Wilson
```

**Scout Profile:**
- Organization: Premier League Scouts
- Verified: Yes

**Access:**
- Academy Dashboard
- Player Discovery
- Favorites Management
- Scouting Reports
- Events Calendar

---

## 🔧 How to Create Additional Users

Run the following command to recreate or verify test users:

```bash
node create-test-users.js
```

---

## 📝 Notes

- All test accounts use the same password: `password123`
- Passwords are securely hashed using bcrypt with 12 salt rounds
- These are development/testing credentials only
- Change passwords in production environment
- The script uses `upsert` to avoid duplicate user errors

---

## 🚀 Quick Login Links

- **Coach:** [Login as Coach](http://localhost:3000/academy/login)
- **Player:** [Login as Player](http://localhost:3000/academy/login)
- **Scout:** [Login as Scout](http://localhost:3000/academy/login)

---

*Last Updated: October 7, 2025*

