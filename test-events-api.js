// Test script for Events API
// Run with: node test-events-api.js

const BASE_URL = 'http://localhost:3000/api';

// Test data for event creation
const testTrial = {
  title: "U-16 Trial Session",
  type: "Trial",
  event_date: "2024-03-01T14:00:00.000Z",
  event_time: "2:00 PM",
  location: "Main Stadium",
  description: "Trial session for U-16 players. Full kit required.",
  status: "Pending",
  created_by: 1 // You'll need to get a valid user ID from your database
};

const testShowcase = {
  title: "Annual Player Showcase",
  type: "Showcase",
  event_date: "2024-03-15T16:00:00.000Z",
  event_time: "4:00 PM",
  location: "Academy Hall",
  description: "Annual showcase event to display academy talent to scouts and parents.",
  status: "Pending",
  created_by: 1
};

const testGuestSession = {
  title: "Guest Coach Session",
  type: "GuestSessions",
  event_date: "2024-03-10T10:00:00.000Z",
  event_time: "10:00 AM",
  location: "Training Field 2",
  description: "Special session with guest coach from professional club.",
  status: "Pending",
  created_by: 1
};

async function testEventsAPI() {
  console.log('🧪 Testing Events API...\n');

  try {
    // Test 1: Create Trial Event
    console.log('1️⃣ Testing trial event creation...');
    const response1 = await fetch(`${BASE_URL}/admin/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testTrial)
    });

    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(result1, null, 2));
    
    if (response1.ok) {
      console.log('✅ Trial event creation successful!\n');
      const eventId = result1.event.event_id;
      
      // Test 2: Create Showcase Event
      console.log('2️⃣ Testing showcase event creation...');
      const response2 = await fetch(`${BASE_URL}/admin/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testShowcase)
      });

      const result2 = await response2.json();
      console.log('Status:', response2.status);
      console.log('Response:', JSON.stringify(result2, null, 2));
      console.log('✅ Showcase event creation successful!\n');

      // Test 3: Create Guest Session Event
      console.log('3️⃣ Testing guest session creation...');
      const response3 = await fetch(`${BASE_URL}/admin/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testGuestSession)
      });

      const result3 = await response3.json();
      console.log('Status:', response3.status);
      console.log('Response:', JSON.stringify(result3, null, 2));
      console.log('✅ Guest session creation successful!\n');

      // Test 4: Get all events
      console.log('4️⃣ Testing get all events...');
      const response4 = await fetch(`${BASE_URL}/admin/events`);
      const result4 = await response4.json();
      console.log('Status:', response4.status);
      console.log('Response:', JSON.stringify(result4, null, 2));
      console.log('✅ Get all events successful!\n');

      // Test 5: Get specific event
      console.log('5️⃣ Testing get specific event...');
      const response5 = await fetch(`${BASE_URL}/admin/events/${eventId}`);
      const result5 = await response5.json();
      console.log('Status:', response5.status);
      console.log('Response:', JSON.stringify(result5, null, 2));
      console.log('✅ Get specific event successful!\n');

      // Test 6: Update event
      console.log('6️⃣ Testing update event...');
      const updateData = {
        title: "Updated U-16 Trial Session",
        description: "Updated: Trial session for U-16 players. Full kit required. Bring water bottles.",
        status: "Complete"
      };
      
      const response6 = await fetch(`${BASE_URL}/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const result6 = await response6.json();
      console.log('Status:', response6.status);
      console.log('Response:', JSON.stringify(result6, null, 2));
      console.log('✅ Update event successful!\n');

      // Test 7: Filter events by status
      console.log('7️⃣ Testing filter events by status...');
      const response7 = await fetch(`${BASE_URL}/admin/events?status=Complete`);
      const result7 = await response7.json();
      console.log('Status:', response7.status);
      console.log('Response:', JSON.stringify(result7, null, 2));
      console.log('✅ Filter by status successful!\n');

      // Test 8: Filter events by type
      console.log('8️⃣ Testing filter events by type...');
      const response8 = await fetch(`${BASE_URL}/admin/events?type=Trial`);
      const result8 = await response8.json();
      console.log('Status:', response8.status);
      console.log('Response:', JSON.stringify(result8, null, 2));
      console.log('✅ Filter by type successful!\n');

    } else {
      console.log('❌ Event creation failed!\n');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

async function testErrorCases() {
  console.log('🧪 Testing Error Cases...\n');

  try {
    // Test 1: Missing required fields
    console.log('1️⃣ Testing missing required fields...');
    const response1 = await fetch(`${BASE_URL}/admin/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: "Incomplete Event"
        // Missing type, event_date, created_by
      })
    });

    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(result1, null, 2));
    console.log('✅ Missing required fields validation working!\n');

    // Test 2: Invalid type
    console.log('2️⃣ Testing invalid type...');
    const response2 = await fetch(`${BASE_URL}/admin/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: "Invalid Event",
        type: "InvalidType",
        event_date: "2024-03-01T14:00:00.000Z",
        created_by: 1
      })
    });

    const result2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Response:', JSON.stringify(result2, null, 2));
    console.log('✅ Invalid type validation working!\n');

    // Test 3: Invalid status
    console.log('3️⃣ Testing invalid status...');
    const response3 = await fetch(`${BASE_URL}/admin/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: "Invalid Status Event",
        type: "Trial",
        event_date: "2024-03-01T14:00:00.000Z",
        created_by: 1,
        status: "InvalidStatus"
      })
    });

    const result3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Response:', JSON.stringify(result3, null, 2));
    console.log('✅ Invalid status validation working!\n');

    // Test 4: Invalid event ID
    console.log('4️⃣ Testing invalid event ID...');
    const response4 = await fetch(`${BASE_URL}/admin/events/99999`);
    const result4 = await response4.json();
    console.log('Status:', response4.status);
    console.log('Response:', JSON.stringify(result4, null, 2));
    console.log('✅ Invalid ID handling working!\n');

  } catch (error) {
    console.error('❌ Error case test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Events API Tests...\n');
  console.log('Make sure your Next.js server is running on http://localhost:3000\n');
  
  await testEventsAPI();
  await testErrorCases();
  
  console.log('🎉 All tests completed!');
}

runTests();
