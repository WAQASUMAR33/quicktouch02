# Academy Authentication System

## Overview
The Academy table now has its own complete authentication system, separate from user authentication. Academies can register, login, verify their email, and reset passwords independently.

## Database Schema

### Academy Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `academy_id` | INT | Yes | Primary key, auto-increment |
| `name` | VARCHAR(150) | Yes | Academy name |
| `email` | VARCHAR(150) | Yes | Unique email for login |
| `password` | VARCHAR(255) | Yes | Hashed password (bcrypt) |
| `email_verified` | BOOLEAN | No | Email verification status (default: false) |
| `email_verification_token` | VARCHAR(255) | No | Token for email verification |
| `email_verification_expiry` | DATETIME | No | Verification token expiry (24 hours) |
| `reset_token` | VARCHAR(255) | No | Hashed token for password reset |
| `reset_token_expiry` | DATETIME | No | Reset token expiry (1 hour) |
| `description` | TEXT | No | Academy description |
| `address` | VARCHAR(255) | No | Physical address |
| `phone` | VARCHAR(20) | No | Contact phone |
| `website` | VARCHAR(255) | No | Website URL |
| `logo_url` | VARCHAR(255) | No | Logo image URL |
| `is_active` | BOOLEAN | Yes | Account status (default: true) |
| `created_at` | TIMESTAMP | Yes | Creation timestamp |
| `updated_at` | TIMESTAMP | Yes | Last update timestamp |

### Indexes
- `idx_academy_email_verification_token` - Fast email verification lookup
- `idx_academy_reset_token` - Fast password reset lookup
- `idx_academy_email_verified` - Filter by verification status

## API Endpoints

### 1. Register Academy
**POST** `/api/auth/academy/register`

**Request Body:**
```json
{
  "name": "Elite Football Academy",
  "email": "contact@eliteacademy.com",
  "password": "securePassword123",
  "phone": "+1234567890",
  "address": "123 Sports Avenue, City",
  "description": "Premier football training facility",
  "website": "https://eliteacademy.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Academy registered successfully. Please check your email to verify your account.",
  "academy": {
    "academy_id": 1,
    "name": "Elite Football Academy",
    "email": "contact@eliteacademy.com",
    "phone": "+1234567890",
    "address": "123 Sports Avenue, City",
    "description": "Premier football training facility",
    "website": "https://eliteacademy.com",
    "email_verified": false,
    "is_active": true,
    "created_at": "2025-10-08T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "verificationToken": "abc123..."
}
```

**Validations:**
- Name, email, and password are required
- Email must be valid format
- Password must be at least 6 characters
- Email must be unique

---

### 2. Login Academy
**POST** `/api/auth/academy/login`

**Request Body:**
```json
{
  "email": "contact@eliteacademy.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "academy": {
    "academy_id": 1,
    "name": "Elite Football Academy",
    "email": "contact@eliteacademy.com",
    "phone": "+1234567890",
    "address": "123 Sports Avenue, City",
    "description": "Premier football training facility",
    "website": "https://eliteacademy.com",
    "email_verified": false,
    "is_active": true,
    "logo_url": null,
    "created_at": "2025-10-08T12:00:00.000Z",
    "updated_at": "2025-10-08T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "emailVerified": false,
  "warning": "Please verify your email address to access all features"
}
```

**Error Responses:**
- `401` - Invalid email or password
- `403` - Account deactivated

---

### 3. Verify Email
**POST** `/api/auth/academy/verify-email`

**Request Body:**
```json
{
  "token": "abc123verificationtoken456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now access all features.",
  "academy": {
    "academy_id": 1,
    "name": "Elite Football Academy",
    "email": "contact@eliteacademy.com",
    "email_verified": true,
    "created_at": "2025-10-08T12:00:00.000Z"
  }
}
```

**GET** `/api/auth/academy/verify-email?token=abc123`

Used for email link verification. Returns same response format.

**Error Responses:**
- `400` - Invalid or expired verification token

---

### 4. Resend Verification Email
**POST** `/api/auth/academy/resend-verification`

**Request Body:**
```json
{
  "email": "contact@eliteacademy.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent successfully. Please check your inbox.",
  "verificationToken": "newtoken123..."
}
```

---

### 5. Forgot Password
**POST** `/api/auth/academy/forgot-password`

**Request Body:**
```json
{
  "email": "contact@eliteacademy.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If an academy with that email exists, a password reset link has been sent.",
  "resetToken": "resettoken123..."
}
```

**Security Features:**
- Always returns success to prevent email enumeration
- Token is SHA-256 hashed in database
- Token expires in 1 hour

---

### 6. Reset Password
**POST** `/api/auth/academy/reset-password`

**Request Body:**
```json
{
  "token": "resettoken123...",
  "password": "newSecurePassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password."
}
```

**Validations:**
- Token must be valid and not expired
- Password must be at least 6 characters
- Token is cleared after successful reset

**Error Responses:**
- `400` - Invalid or expired reset token
- `400` - Password too short

---

## JWT Token Structure

The JWT token for academies contains:
```json
{
  "academy_id": 1,
  "email": "contact@eliteacademy.com",
  "name": "Elite Football Academy",
  "type": "academy"
}
```

The `type: "academy"` field distinguishes academy tokens from user tokens.

---

## Security Features

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **Minimum Length**: 6 characters
- **No storage**: Plain text passwords never stored

### Token Security
- **Email Verification**: 
  - Random 32-byte hex token
  - 24-hour expiry
  - Cleared after use
  
- **Password Reset**:
  - Random 32-byte hex token
  - SHA-256 hashed in database
  - 1-hour expiry
  - Cleared after use

### Email Enumeration Prevention
- Forgot password always returns success
- No differentiation between existing/non-existing emails

### Account Protection
- Active status check on login
- Email verification recommended
- Token expiry enforcement

---

## Database Migration

Run the migration to add authentication fields:

```bash
node sync-academy-auth.js
```

This will:
1. Make `email` field required and unique
2. Add `password` field (required)
3. Add email verification fields
4. Add password reset fields
5. Create performance indexes

---

## Integration Example

### Frontend Login Flow

```javascript
// 1. Login
const loginResponse = await fetch('/api/auth/academy/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'contact@eliteacademy.com',
    password: 'securePassword123'
  })
});

const { token, academy, emailVerified } = await loginResponse.json();

// 2. Store token
localStorage.setItem('academy_token', token);
localStorage.setItem('academy_data', JSON.stringify(academy));

// 3. Check email verification
if (!emailVerified) {
  // Show verification reminder
  // Offer to resend verification email
}

// 4. Use token for authenticated requests
const response = await fetch('/api/academy/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Email Verification Flow

```javascript
// User clicks link in email: /academy/verify-email?token=abc123

const verifyResponse = await fetch('/api/auth/academy/verify-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: 'abc123' })
});

const { success, message } = await verifyResponse.json();
// Show success message and redirect to login
```

### Password Reset Flow

```javascript
// 1. Request reset
await fetch('/api/auth/academy/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'contact@eliteacademy.com' })
});

// 2. User clicks link in email: /academy/reset-password?token=xyz789

// 3. Submit new password
await fetch('/api/auth/academy/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: 'xyz789',
    password: 'newSecurePassword456'
  })
});
```

---

## TODO / Future Enhancements

1. **Email Service Integration**
   - Implement actual email sending (SendGrid, Nodemailer, AWS SES)
   - Create email templates for verification and password reset
   - Add email configuration to environment variables

2. **UI Pages**
   - Academy registration page
   - Academy login page
   - Email verification page
   - Password reset request page
   - Password reset page

3. **Additional Features**
   - Two-factor authentication (2FA)
   - Login attempt tracking
   - Account lockout after failed attempts
   - Email change functionality
   - Profile update endpoint
   - Audit log for authentication events

4. **Admin Features**
   - Academy approval workflow
   - Manual email verification by admin
   - Force password reset
   - Account suspension/activation

---

## Testing

### Test Academy Registration
```bash
curl -X POST http://localhost:3000/api/auth/academy/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Academy",
    "email": "test@academy.com",
    "password": "test123",
    "phone": "+1234567890"
  }'
```

### Test Academy Login
```bash
curl -X POST http://localhost:3000/api/auth/academy/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@academy.com",
    "password": "test123"
  }'
```

---

## Migration Status

✅ **Completed:**
- Prisma schema updated
- Database migration created
- Database fields added
- Indexes created
- API endpoints implemented
- Security features implemented

⏳ **Pending:**
- Email service integration
- Frontend UI pages
- Testing suite
- Documentation for frontend integration

---

## Support

For issues or questions about the Academy authentication system:
1. Check this documentation
2. Review the API endpoint responses
3. Check database migration status
4. Verify token expiry times
5. Ensure email service is configured (when implemented)

---

**Last Updated:** October 8, 2025  
**Version:** 1.0.0

