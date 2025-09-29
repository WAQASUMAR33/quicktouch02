# 🔐 Login API Documentation

## Overview
The Login API provides secure authentication for users across all roles in the QuickTouch system. It supports comprehensive validation, JWT token generation, and detailed user information retrieval.

## Endpoints

### 1. GET `/api/auth/login`
**Description:** Get login form data, validation rules, and supported features.

**Response:**
```json
{
  "validationRules": {
    "email": {
      "required": true,
      "format": "email",
      "message": "Please enter a valid email address"
    },
    "password": {
      "required": true,
      "minLength": 6,
      "message": "Password must be at least 6 characters long"
    }
  },
  "features": {
    "rememberMe": true,
    "forgotPassword": false,
    "socialLogin": false,
    "twoFactor": false
  },
  "supportedRoles": ["admin", "coach", "player", "scout", "parent"]
}
```

### 2. POST `/api/auth/login`
**Description:** Authenticate user and generate JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": false
}
```

**Required Fields:**
- `email` (string): Valid email address
- `password` (string): Minimum 6 characters

**Optional Fields:**
- `rememberMe` (boolean): Extends token expiration to 30 days (default: 7 days)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 8,
    "email": "user@example.com",
    "role": "player",
    "fullName": "John Smith",
    "phone": "+1234567890",
    "profilePic": null,
    "academyId": 1,
    "academy": {
      "academy_id": 1,
      "name": "Elite Football Academy",
      "description": "Premier football training facility"
    },
    "playerProfile": {
      "player_id": 5,
      "age": 19,
      "position": "Forward"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "expiresIn": "7d"
}
```

**Error Responses:**

**400 - Validation Error:**
```json
{
  "error": "Invalid email format"
}
```

**401 - Invalid Credentials:**
```json
{
  "error": "Invalid email or password"
}
```

**500 - Server Error:**
```json
{
  "error": "Internal server error",
  "details": "Error message details"
}
```

## Authentication Features

### JWT Token Management
- **Standard Token:** 7 days expiration
- **Remember Me Token:** 30 days expiration
- **Token Payload:** Contains userId, email, role, and fullName
- **Secure Generation:** Uses JWT_SECRET from environment variables

### Password Security
- **Hashing:** bcrypt with salt rounds
- **Validation:** Minimum 6 characters required
- **Comparison:** Secure password verification

### User Data Retrieval
- **Complete Profile:** Includes academy and player profile information
- **Role-based Data:** Returns relevant data based on user role
- **Academy Association:** Includes academy details if user belongs to one
- **Player Profile:** Includes player-specific data for players

## Validation Rules

### Email Validation
- Must be a valid email format
- Required field
- Case-insensitive matching

### Password Validation
- Minimum 6 characters
- Required field
- Secure comparison with hashed password

### Account Status
- User must exist in database
- Password must match stored hash
- Account must be active (future feature)

## Security Features

### Input Validation
- Email format validation
- Password length validation
- Required field validation
- SQL injection protection via Prisma

### Error Handling
- Generic error messages for security
- Detailed logging for debugging
- Proper HTTP status codes

### Token Security
- JWT with expiration
- Configurable expiration times
- Secure secret key management

## Database Operations

The API performs the following operations:

1. **User Lookup:**
   - Finds user by email address
   - Includes academy and player profile data
   - Uses Prisma ORM for safe queries

2. **Password Verification:**
   - Compares provided password with stored hash
   - Uses bcrypt for secure comparison

3. **Token Generation:**
   - Creates JWT with user information
   - Sets appropriate expiration time
   - Returns token for client storage

## Usage Examples

### JavaScript/Fetch
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    rememberMe: true
  })
});

const result = await response.json();
if (result.success) {
  localStorage.setItem('token', result.token);
  localStorage.setItem('user', JSON.stringify(result.user));
}
```

### cURL
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "rememberMe": false
  }'
```

### React Hook Example
```javascript
const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });
      
      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        return result.user;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError('Network error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
```

## Testing

### Test Scripts
- `test-login-api.js` - Comprehensive Node.js test script
- `test-login.html` - Interactive HTML test page

### Test Coverage
- Valid login attempts
- Invalid credentials
- Validation errors
- Missing fields
- Remember me functionality
- Different user roles

## Integration Notes

- **Token Storage:** Store JWT token in localStorage or secure cookie
- **User Data:** Store user information for UI display
- **Role-based Routing:** Use user role for navigation and permissions
- **Token Refresh:** Implement token refresh logic for long sessions
- **Logout:** Clear stored tokens and user data on logout

## Future Enhancements

- **Forgot Password:** Password reset functionality
- **Two-Factor Authentication:** Additional security layer
- **Social Login:** OAuth integration
- **Account Lockout:** Brute force protection
- **Session Management:** Server-side session tracking
- **Audit Logging:** Login attempt logging
