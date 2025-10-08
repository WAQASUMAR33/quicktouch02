# Super Admin Credentials

## Super Admin Account

**Created:** October 8, 2025

### Login Credentials

```
Email:    admin@quicktouch.com
Password: admin123
Role:     admin
```

### Login URLs

- **Local:** http://localhost:3000/admin/login
- **Production:** https://quicktouch02.vercel.app/admin/login

---

## Super Admin Powers

The super admin account has full access to:

### 👥 User Management
- View all users (players, coaches, scouts, admins)
- Create new users
- Update user information
- Deactivate/activate accounts
- Manage user roles

### 🏛️ Academy Management
- View all academies
- Create new academies
- Update academy information
- Activate/deactivate academies
- View academy statistics

### 📅 Event Management
- View all events across all academies
- Create system-wide events
- Edit any event
- Delete events
- Manage event types

### 📚 Training Programs
- View all training plans
- Access all academy training programs
- System-wide training oversight

### 📊 Dashboard Access
- System-wide statistics
- Total players count
- Total events count
- Total academies count
- Training programs overview
- Recent activity monitoring

---

## Security Notes

### Important

⚠️ **Change the default password immediately in production!**

This default password is for development/testing only.

### Recommended Actions

1. **Change Password:**
   - Login to admin portal
   - Go to profile/settings
   - Update to a strong password

2. **Strong Password Requirements:**
   - Minimum 12 characters
   - Mix of uppercase and lowercase
   - Include numbers
   - Include special characters
   - Example: `Admin@QuickT0uch!2025`

3. **Additional Security:**
   - Enable two-factor authentication (when implemented)
   - Use unique email address
   - Regularly update password
   - Monitor login activity
   - Review admin logs

---

## API Endpoints for Admin

### Authentication
- `POST /api/auth/login` - Admin login (role: admin)
- `POST /api/auth/register` - Create new admin (requires existing admin)

### User Management
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Academy Management
- `GET /api/academies` - Get all academies
- `POST /api/academies/register` - Create academy
- `PUT /api/academies/:id` - Update academy
- `DELETE /api/academies/:id` - Delete academy

### Events Management
- `GET /api/admin/events-simple` - Get all events
- `POST /api/admin/events-simple` - Create event
- `PUT /api/admin/events-simple/:id` - Update event
- `DELETE /api/admin/events-simple/:id` - Delete event

### Dashboard
- `GET /api/admin/dashboard` - Get admin dashboard stats

---

## Creation Methods

### Method 1: API Endpoint (Used)
```bash
POST http://localhost:3000/api/test/create-super-admin
```

### Method 2: Direct Script
```bash
node create-super-admin.js
```

### Method 3: SQL Script
```sql
INSERT INTO Users (
  full_name, 
  email, 
  password, 
  phone, 
  role, 
  created_at, 
  updated_at
) VALUES (
  'Super Admin',
  'admin@quicktouch.com',
  '$2b$10$hashedPasswordHere',
  '+1234567890',
  'admin',
  NOW(),
  NOW()
);
```

---

## Admin vs Academy

### Super Admin (Users Table)
- **Table:** Users
- **Role:** admin
- **Storage:** admin_token, admin_user
- **Scope:** Entire system
- **Access:** /admin/*
- **Purpose:** System administration

### Academy Admin (Academies Table)
- **Table:** Academies
- **Role:** academy
- **Storage:** academy_token, academy_data
- **Scope:** Single academy
- **Access:** /academy/*
- **Purpose:** Academy management

---

## Testing the Admin Account

### Step 1: Login
```
1. Go to http://localhost:3000/admin/login
2. Enter email: admin@quicktouch.com
3. Enter password: admin123
4. Click "Sign In as Admin"
```

### Step 2: Access Dashboard
```
Should redirect to: /admin/dashboard
See:
- Total Players: 45
- Total Events: (actual count)
- Total Academies: (actual count)
- Training Programs: 12
```

### Step 3: Test Admin Features
```
- View all academies
- View all events
- Manage users
- Access system settings
```

---

## Backup Admin Account

If you need to create another admin:

```javascript
POST /api/auth/register
{
  "full_name": "Backup Admin",
  "email": "backup@quicktouch.com",
  "password": "securePassword123",
  "role": "admin"
}
```

---

## User ID Information

- **Super Admin User ID:** 1
- **Email:** admin@quicktouch.com
- **Role:** admin
- **Status:** Active

---

## Production Deployment

Before deploying to production:

1. ✅ Create admin account in production database
2. ✅ Use strong, unique password
3. ✅ Store credentials securely (password manager)
4. ✅ Enable additional security features
5. ✅ Set up admin email notifications
6. ✅ Configure audit logging
7. ✅ Limit admin access to specific IPs (optional)

---

**Last Updated:** October 8, 2025  
**Status:** Super Admin account active and ready to use

