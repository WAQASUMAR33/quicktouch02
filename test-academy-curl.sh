#!/bin/bash

# Test script for Academy Registration API using curl
# Make sure your Next.js server is running on http://localhost:3000

BASE_URL="http://localhost:3000/api"

echo "🧪 Testing Academy Registration API with curl..."
echo ""

# Test 1: Register an academy
echo "1️⃣ Testing academy registration..."
ACADEMY_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/academies/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arsenal Academy",
    "description": "Premier League youth development program",
    "address": "London Colney, Hertfordshire, UK",
    "phone": "+44 20 7619 5000",
    "email": "academy@arsenal.com",
    "website": "https://www.arsenal.com/academy",
    "logo_url": "https://example.com/arsenal-logo.png"
  }')

echo "$ACADEMY_RESPONSE"
echo ""

# Extract academy ID from response (assuming it's successful)
ACADEMY_ID=$(echo "$ACADEMY_RESPONSE" | head -n -1 | jq -r '.academy.academy_id' 2>/dev/null)

if [ "$ACADEMY_ID" != "null" ] && [ "$ACADEMY_ID" != "" ]; then
    echo "✅ Academy registered with ID: $ACADEMY_ID"
    echo ""

    # Test 2: Get all academies
    echo "2️⃣ Testing get all academies..."
    curl -s -X GET "$BASE_URL/academies" | jq '.'
    echo ""

    # Test 3: Get specific academy
    echo "3️⃣ Testing get academy by ID..."
    curl -s -X GET "$BASE_URL/academies/$ACADEMY_ID" | jq '.'
    echo ""

    # Test 4: Update academy
    echo "4️⃣ Testing update academy..."
    curl -s -X PUT "$BASE_URL/academies/$ACADEMY_ID" \
      -H "Content-Type: application/json" \
      -d '{
        "description": "Updated: Premier League youth development program with new facilities!",
        "website": "https://www.arsenal.com/academy/new"
      }' | jq '.'
    echo ""

else
    echo "❌ Failed to register academy or extract ID"
fi

# Test 5: Error case - missing name
echo "5️⃣ Testing error case - missing name..."
curl -s -X POST "$BASE_URL/academies/register" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Academy without name",
    "email": "test@example.com"
  }' | jq '.'
echo ""

echo "🎉 All curl tests completed!"
