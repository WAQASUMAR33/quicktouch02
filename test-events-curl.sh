#!/bin/bash

# Events API Test Script using curl
# Run with: bash test-events-curl.sh

BASE_URL="https://quicktouch02.vercel.app/api/admin/events"

echo "🚀 Testing Events API at: $BASE_URL"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $2 -eq 200 ] || [ $2 -eq 201 ]; then
        echo -e "${GREEN}✅ $1 - Status: $2${NC}"
    else
        echo -e "${RED}❌ $1 - Status: $2${NC}"
    fi
}

# Test 1: Get all events
echo -e "\n${BLUE}1️⃣ Testing GET all events...${NC}"
response=$(curl -s -w "%{http_code}" -o /tmp/events_get.json "$BASE_URL")
status_code=$(echo $response | tail -c 4)
print_status "GET All Events" $status_code
if [ $status_code -eq 200 ]; then
    echo "Response:"
    cat /tmp/events_get.json | jq '.' 2>/dev/null || cat /tmp/events_get.json
fi

# Test 2: Create a Trial Event
echo -e "\n${BLUE}2️⃣ Testing POST create trial event...${NC}"
trial_data='{
  "title": "U-16 Trial Session",
  "type": "Trial",
  "event_date": "2024-03-01T14:00:00.000Z",
  "event_time": "2:00 PM",
  "location": "Main Stadium",
  "description": "Trial session for U-16 players. Full kit required.",
  "status": "Pending",
  "created_by": 1
}'

response=$(curl -s -w "%{http_code}" -o /tmp/events_create.json \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$trial_data" \
  "$BASE_URL")

status_code=$(echo $response | tail -c 4)
print_status "POST Create Trial Event" $status_code
if [ $status_code -eq 201 ]; then
    echo "Response:"
    cat /tmp/events_create.json | jq '.' 2>/dev/null || cat /tmp/events_create.json
    
    # Extract event ID for further tests
    event_id=$(cat /tmp/events_create.json | jq -r '.event.event_id' 2>/dev/null)
    if [ "$event_id" != "null" ] && [ "$event_id" != "" ]; then
        echo -e "${YELLOW}Event ID: $event_id${NC}"
    fi
else
    echo "Response:"
    cat /tmp/events_create.json | jq '.' 2>/dev/null || cat /tmp/events_create.json
fi

# Test 3: Create a Showcase Event
echo -e "\n${BLUE}3️⃣ Testing POST create showcase event...${NC}"
showcase_data='{
  "title": "Annual Player Showcase",
  "type": "Showcase",
  "event_date": "2024-03-15T16:00:00.000Z",
  "event_time": "4:00 PM",
  "location": "Academy Hall",
  "description": "Annual showcase event to display academy talent.",
  "status": "Pending",
  "created_by": 1
}'

response=$(curl -s -w "%{http_code}" -o /tmp/events_showcase.json \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$showcase_data" \
  "$BASE_URL")

status_code=$(echo $response | tail -c 4)
print_status "POST Create Showcase Event" $status_code

# Test 4: Create a Guest Session Event
echo -e "\n${BLUE}4️⃣ Testing POST create guest session...${NC}"
guest_data='{
  "title": "Guest Coach Session",
  "type": "GuestSessions",
  "event_date": "2024-03-10T10:00:00.000Z",
  "event_time": "10:00 AM",
  "location": "Training Field 2",
  "description": "Special session with guest coach from professional club.",
  "status": "Pending",
  "created_by": 1
}'

response=$(curl -s -w "%{http_code}" -o /tmp/events_guest.json \
  -X POST \
  -H "Content-Type: application/json" \
  -d "$guest_data" \
  "$BASE_URL")

status_code=$(echo $response | tail -c 4)
print_status "POST Create Guest Session" $status_code

# Test 5: Get events by status
echo -e "\n${BLUE}5️⃣ Testing GET events by status (Pending)...${NC}"
response=$(curl -s -w "%{http_code}" -o /tmp/events_status.json "$BASE_URL?status=Pending")
status_code=$(echo $response | tail -c 4)
print_status "GET Events by Status (Pending)" $status_code

# Test 6: Get events by type
echo -e "\n${BLUE}6️⃣ Testing GET events by type (Trial)...${NC}"
response=$(curl -s -w "%{http_code}" -o /tmp/events_type.json "$BASE_URL?type=Trial")
status_code=$(echo $response | tail -c 4)
print_status "GET Events by Type (Trial)" $status_code

# Test 7: Get specific event by ID (if we have an event ID)
if [ "$event_id" != "null" ] && [ "$event_id" != "" ]; then
    echo -e "\n${BLUE}7️⃣ Testing GET event by ID ($event_id)...${NC}"
    response=$(curl -s -w "%{http_code}" -o /tmp/events_get_id.json "$BASE_URL/$event_id")
    status_code=$(echo $response | tail -c 4)
    print_status "GET Event by ID" $status_code
    
    # Test 8: Update event
    echo -e "\n${BLUE}8️⃣ Testing PUT update event...${NC}"
    update_data='{
      "title": "Updated Trial Session",
      "description": "This trial session has been updated with new information.",
      "status": "Complete"
    }'
    
    response=$(curl -s -w "%{http_code}" -o /tmp/events_update.json \
      -X PUT \
      -H "Content-Type: application/json" \
      -d "$update_data" \
      "$BASE_URL/$event_id")
    
    status_code=$(echo $response | tail -c 4)
    print_status "PUT Update Event" $status_code
else
    echo -e "\n${YELLOW}⚠️ Skipping ID-specific tests (no event ID available)${NC}"
fi

# Test 9: Test error cases
echo -e "\n${BLUE}9️⃣ Testing error cases...${NC}"

# Test invalid data
echo "Testing invalid data (missing required fields)..."
response=$(curl -s -w "%{http_code}" -o /tmp/events_error.json \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"title": "Invalid Event"}' \
  "$BASE_URL")

status_code=$(echo $response | tail -c 4)
if [ $status_code -eq 400 ]; then
    echo -e "${GREEN}✅ Error handling working - Status: $status_code${NC}"
else
    echo -e "${RED}❌ Error handling not working - Status: $status_code${NC}"
fi

# Test invalid event ID
echo "Testing invalid event ID..."
response=$(curl -s -w "%{http_code}" -o /tmp/events_invalid_id.json "$BASE_URL/99999")
status_code=$(echo $response | tail -c 4)
if [ $status_code -eq 404 ]; then
    echo -e "${GREEN}✅ Invalid ID handling working - Status: $status_code${NC}"
else
    echo -e "${RED}❌ Invalid ID handling not working - Status: $status_code${NC}"
fi

# Summary
echo -e "\n${BLUE}📊 Test Summary${NC}"
echo "================"
echo "All tests completed! Check the results above."
echo -e "\n${YELLOW}💡 Tips:${NC}"
echo "- If you see 500 errors, the database schema might need updating"
echo "- If you see 200/201 status codes, the API is working correctly"
echo "- Use the HTML test page (test-events-api.html) for interactive testing"

# Cleanup temporary files
rm -f /tmp/events_*.json

echo -e "\n🎉 Testing complete!"
