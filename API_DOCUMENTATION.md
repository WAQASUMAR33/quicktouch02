# QuickTouch API Documentation

## Overview
Complete REST API for the QuickTouch football academy management system.

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Role-based Access Control
- **player**: Basic user with player profile
- **parent**: Parent/guardian of players
- **coach**: Can manage training plans, give feedback, create events
- **scout**: Can search and favorite players
- **admin**: Full system access

---

## Authentication Endpoints

### POST /auth/register
Register a new user
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "player",
  "academy_id": 1
}
```

### POST /auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### GET /auth/profile
Get current user profile (requires auth)

### PUT /auth/profile
Update current user profile (requires auth)
```json
{
  "full_name": "John Smith",
  "phone": "+1234567890",
  "profile_pic": "https://example.com/pic.jpg",
  "current_password": "oldpassword",
  "new_password": "newpassword"
}
```

---

## Player Endpoints

### GET /players
Get all players with filtering
Query params: `age`, `position`, `minGoals`, `limit`, `offset`

### POST /players
Create player profile (requires auth)
```json
{
  "age": 18,
  "height_cm": 180,
  "weight_kg": 75,
  "position": "Forward",
  "preferred_foot": "Right"
}
```

### GET /players/[id]
Get specific player details

### GET /players/[id]/stats
Get player statistics
Query params: `season`

### POST /players/[id]/stats
Add/update player statistics (coach/admin only)
```json
{
  "season": "2024-25",
  "matches_played": 15,
  "goals": 8,
  "assists": 5,
  "minutes_played": 1200
}
```

### GET /players/[id]/videos
Get player highlight videos

### POST /players/[id]/videos
Upload highlight video (player/coach/admin)
```json
{
  "video_url": "https://youtube.com/watch?v=example",
  "description": "Goal against City FC"
}
```

### DELETE /players/[id]/videos?videoId=123
Delete highlight video

---

## Scout Endpoints

### GET /scouts
Get all scouts (admin only)

### POST /scouts
Create scout profile (requires scout role)
```json
{
  "organization": "Premier League Scouts"
}
```

### GET /scouts/[id]/favorites
Get scout's favorite players

### POST /scouts/[id]/favorites
Add player to favorites
```json
{
  "player_id": 123
}
```

### DELETE /scouts/[id]/favorites?playerId=123
Remove player from favorites

---

## Coach Endpoints

### GET /coach/feedback
Get coach's feedback records
Query params: `playerId`, `limit`, `offset`

### POST /coach/feedback
Create feedback for player (coach only)
```json
{
  "player_id": 123,
  "rating": 8.5,
  "notes": "Excellent performance in training",
  "feedback_date": "2024-01-15"
}
```

### GET /coach/training-plans
Get training plans

### POST /coach/training-plans
Create training plan (coach only)
```json
{
  "title": "Shooting Drills",
  "description": "Focus on accuracy and power",
  "video_url": "https://youtube.com/watch?v=training"
}
```

### PUT /coach/training-plans?id=123
Update training plan (coach only)

### DELETE /coach/training-plans?id=123
Delete training plan (coach only)

---

## Event Endpoints

### GET /events
Get events
Query params: `type`, `startDate`, `endDate`, `limit`, `offset`

### POST /events
Create event (coach/admin only)
```json
{
  "title": "Weekly Training",
  "type": "training",
  "event_date": "2024-01-20T10:00:00Z",
  "location": "Main Field",
  "description": "Regular training session"
}
```

### PUT /events?id=123
Update event (creator/admin only)

### DELETE /events?id=123
Delete event (creator/admin only)

### GET /events/[id]/attendance
Get event attendance

### POST /events/[id]/attendance
Mark attendance (coach/admin only)
```json
{
  "player_id": 123,
  "present": true,
  "performance_rating": 8.0,
  "notes": "Good performance"
}
```

### PUT /events/[id]/attendance/bulk
Bulk update attendance (coach/admin only)
```json
{
  "attendance_records": [
    {
      "player_id": 123,
      "present": true,
      "performance_rating": 8.0
    }
  ]
}
```

---

## Messaging Endpoints

### GET /messages
Get conversations or messages
Query params: `chatId`, `limit`, `offset`

### POST /messages
Send message
```json
{
  "receiver_id": 123,
  "message_text": "Hello, how are you?",
  "chat_id": 12345 // optional
}
```

### PUT /messages/mark-read
Mark messages as read
```json
{
  "chat_id": 12345
}
```

### GET /messages/unread-count
Get unread message count

---

## Shop Endpoints

### GET /shop/items
Get shop items
Query params: `category`, `search`, `active`, `limit`, `offset`

### POST /shop/items
Create shop item (admin only)
```json
{
  "name": "Team Jersey",
  "description": "Official team jersey",
  "price": 49.99,
  "stock": 100,
  "category": "Apparel",
  "image_url": "https://example.com/jersey.jpg"
}
```

### GET /shop/items/[id]
Get single shop item

### PUT /shop/items?id=123
Update shop item (admin only)

### DELETE /shop/items?id=123
Delete shop item (admin only)

---

## Admin Endpoints

### GET /admin/dashboard
Get admin dashboard statistics

### GET /admin/users
Get all users with filtering
Query params: `role`, `search`, `limit`, `offset`

### PUT /admin/users?id=123
Update user (admin only)

### DELETE /admin/users?id=123
Delete user (admin only)

### PUT /admin/scouts/verify
Verify/unverify scout (admin only)
```json
{
  "scout_id": 123,
  "verified": true
}
```

---

## Error Responses

All endpoints return consistent error responses:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

---

## Rate Limiting
API requests are limited to 100 requests per minute per user.

## Data Validation
All input data is validated on the server side. Invalid data will return a 400 status with specific error messages.
