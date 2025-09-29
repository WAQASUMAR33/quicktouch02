# ⚽ Player Registration API Documentation

## Overview
The Player Registration API allows new players to register in the system with comprehensive validation and profile creation.

## Endpoints

### 1. GET `/api/players/register`
**Description:** Get registration form data including available academies, positions, and validation rules.

**Response:**
```json
{
  "academies": [
    {
      "academy_id": 1,
      "name": "Elite Football Academy",
      "description": "Premier football training facility",
      "address": "123 Sports Street, City"
    }
  ],
  "positions": [
    "Goalkeeper", "Defender", "Midfielder", "Forward", "Winger",
    "Center Back", "Full Back", "Defensive Midfielder", "Attacking Midfielder",
    "Striker", "Left Wing", "Right Wing"
  ],
  "preferredFootOptions": ["Left", "Right"],
  "validationRules": {
    "age": { "min": 5, "max": 50 },
    "height": { "min": 100, "max": 250, "unit": "cm" },
    "weight": { "min": 20, "max": 150, "unit": "kg" },
    "password": { "minLength": 6 }
  }
}
```

### 2. POST `/api/players/register`
**Description:** Register a new player with user account and player profile.

**Request Body:**
```json
{
  "full_name": "Ahmed Hassan",
  "email": "ahmed.hassan@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "academy_id": 1,
  "age": 18,
  "height_cm": 175,
  "weight_kg": 70,
  "position": "Midfielder",
  "preferred_foot": "Right"
}
```

**Required Fields:**
- `full_name` (string): Player's full name
- `email` (string): Valid email address
- `password` (string): Minimum 6 characters

**Optional Fields:**
- `phone` (string): Phone number
- `academy_id` (integer): Academy ID to associate with
- `age` (integer): Age between 5-50
- `height_cm` (integer): Height between 100-250cm
- `weight_kg` (integer): Weight between 20-150kg
- `position` (string): Valid football position
- `preferred_foot` (string): "Left" or "Right"

**Success Response (201):**
```json
{
  "success": true,
  "message": "Player registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": 5,
    "email": "ahmed.hassan@example.com",
    "role": "player",
    "fullName": "Ahmed Hassan",
    "academyId": 1
  },
  "playerProfile": {
    "playerId": 2,
    "age": 18,
    "heightCm": 175,
    "weightKg": 70,
    "position": "Midfielder",
    "preferredFoot": "Right"
  }
}
```

**Error Responses:**

**400 - Validation Error:**
```json
{
  "error": "Invalid email format"
}
```

**409 - Duplicate Email:**
```json
{
  "error": "User with this email already exists"
}
```

**500 - Server Error:**
```json
{
  "error": "Internal server error",
  "details": "Error message details"
}
```

## Validation Rules

### Email Validation
- Must be a valid email format
- Must be unique in the system

### Password Validation
- Minimum 6 characters
- Automatically hashed with bcrypt

### Age Validation
- Must be between 5 and 50 years

### Height Validation
- Must be between 100cm and 250cm

### Weight Validation
- Must be between 20kg and 150kg

### Position Validation
- Must be one of the valid positions:
  - Goalkeeper, Defender, Midfielder, Forward, Winger
  - Center Back, Full Back, Defensive Midfielder, Attacking Midfielder
  - Striker, Left Wing, Right Wing

### Preferred Foot Validation
- Must be either "Left" or "Right"

## Database Operations

The API performs the following operations in a transaction:

1. **User Creation:**
   - Creates a new user record in the `Users` table
   - Sets role to "player"
   - Hashes the password
   - Associates with academy if provided

2. **Player Profile Creation:**
   - Creates a new player profile in the `PlayerProfiles` table
   - Links to the created user
   - Stores physical attributes and position data

3. **Authentication:**
   - Generates JWT token for immediate login
   - Returns user and profile information

## Testing

### Test Scripts
- `test-player-registration-api.js` - Node.js test script
- `test-player-registration.html` - Interactive HTML test page

### Test Data Examples
```javascript
const testPlayer = {
  full_name: "Ahmed Hassan",
  email: "ahmed.hassan@example.com",
  phone: "+1234567890",
  password: "password123",
  academy_id: 1,
  age: 18,
  height_cm: 175,
  weight_kg: 70,
  position: "Midfielder",
  preferred_foot: "Right"
};
```

## Usage Examples

### JavaScript/Fetch
```javascript
const response = await fetch('/api/players/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    full_name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    password: "password123",
    age: 18,
    position: "Midfielder"
  })
});

const result = await response.json();
if (result.success) {
  console.log('Player registered:', result.user);
  localStorage.setItem('token', result.token);
}
```

### cURL
```bash
curl -X POST http://localhost:3000/api/players/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Ahmed Hassan",
    "email": "ahmed.hassan@example.com",
    "password": "password123",
    "age": 18,
    "position": "Midfielder"
  }'
```

## Security Features

1. **Password Hashing:** All passwords are hashed using bcrypt
2. **Input Validation:** Comprehensive validation on all inputs
3. **SQL Injection Protection:** Uses Prisma ORM for safe database operations
4. **Transaction Safety:** All operations wrapped in database transactions
5. **JWT Authentication:** Returns secure JWT token for immediate login

## Error Handling

The API provides detailed error messages for:
- Missing required fields
- Invalid data formats
- Duplicate email addresses
- Validation rule violations
- Database connection issues

## Integration Notes

- The API automatically creates both user and player profile records
- Returns JWT token for immediate authentication
- Supports academy association during registration
- All optional fields can be updated later via profile update APIs
- Compatible with existing authentication system

