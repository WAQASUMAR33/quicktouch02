# Academy Signup API - Sample Input

## API Endpoint
```
POST /api/auth/academy/register
```

## Headers
```json
{
  "Content-Type": "application/json"
}
```

## Sample JSON Input

### Minimal Required Fields
```json
{
  "name": "Elite Football Academy",
  "email": "academy@example.com",
  "password": "SecurePassword123!"
}
```

### Complete Input with All Fields
```json
{
  "name": "Elite Football Academy",
  "email": "academy@example.com",
  "password": "SecurePassword123!",
  "phone": "+92 300 1234567",
  "address": "123 Stadium Road, Karachi, Pakistan",
  "description": "Premier football academy focused on developing young talent through professional coaching and modern training facilities.",
  "website": "https://www.elitefootball.com"
}
```

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ✅ Yes | Academy name (max 150 characters) |
| `email` | String | ✅ Yes | Valid email address (must be unique) |
| `password` | String | ✅ Yes | Minimum 8 characters |
| `phone` | String | ❌ No | Contact phone number (max 20 characters) |
| `address` | String | ❌ No | Physical address (max 255 characters) |
| `description` | String | ❌ No | Academy description |
| `website` | String | ❌ No | Academy website URL |

## Example Success Response

```json
{
  "success": true,
  "message": "Academy registered successfully. Please check your email to verify your account.",
  "academy": {
    "academy_id": 1,
    "name": "Elite Football Academy",
    "email": "academy@example.com",
    "phone": "+92 300 1234567",
    "address": "123 Stadium Road, Karachi, Pakistan",
    "description": "Premier football academy...",
    "website": "https://www.elitefootball.com",
    "email_verified": false,
    "is_active": true,
    "created_at": "2025-10-10T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Example Error Responses

### Missing Required Fields
```json
{
  "error": "Name, email, and password are required"
}
```

### Email Already Exists
```json
{
  "error": "An academy with this email already exists"
}
```

### Validation Error
```json
{
  "error": "Invalid email format"
}
```

## Testing with cURL

```bash
curl -X POST https://quicktouch02.vercel.app/api/auth/academy/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Elite Football Academy",
    "email": "test@academy.com",
    "password": "SecurePass123!",
    "phone": "+92 300 1234567",
    "address": "123 Stadium Road, Karachi",
    "description": "Professional football training academy"
  }'
```

## Testing with Postman

1. **Method**: POST
2. **URL**: `https://quicktouch02.vercel.app/api/auth/academy/register`
3. **Headers**: 
   - `Content-Type: application/json`
4. **Body** (raw JSON):
```json
{
  "name": "Elite Football Academy",
  "email": "test@academy.com",
  "password": "SecurePass123!",
  "phone": "+92 300 1234567"
}
```

## Important Notes

1. ⚠️ **Email Verification Required**: After registration, a verification email will be sent. The academy must verify their email before logging in.

2. 📧 **Email Will Be Sent To**: The email address provided in the registration

3. 🔗 **Verification Link**: The email contains a verification link that expires in 24 hours

4. ✅ **After Verification**: Academy can log in using their email and password

5. 🔐 **Password Requirements**: 
   - Minimum 8 characters recommended
   - Should contain letters and numbers for security

## Testing Locally

Create a file `test-academy-signup.json`:
```json
{
  "name": "Test Football Academy",
  "email": "theitxprts786@gmail.com",
  "password": "TestPassword123!",
  "phone": "+92 300 1234567",
  "address": "Test Address, Lahore",
  "description": "Test academy for development"
}
```

Then use:
```bash
curl -X POST http://localhost:3000/api/auth/academy/register \
  -H "Content-Type: application/json" \
  -d @test-academy-signup.json
```

## What Happens After Signup

1. ✅ Academy account is created in database
2. 📧 Verification email is sent to the provided email address
3. 🔐 JWT token is returned (for storing session)
4. ⏳ Email verification is pending (`email_verified: false`)
5. 📬 Academy receives email with verification link
6. ✅ Click link to verify email
7. 🚪 Can now log in with full access

