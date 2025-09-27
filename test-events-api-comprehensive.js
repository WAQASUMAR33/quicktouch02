// Comprehensive Events API Test Script
// Run with: node test-events-api-comprehensive.js

const BASE_URL = 'https://quicktouch02.vercel.app/api';

// Sample testing data for different event types
const sampleEvents = {
  trial: {
    title: "U-16 Trial Session",
    type: "Trial",
    event_date: "2024-03-01T14:00:00.000Z",
    event_time: "2:00 PM",
    location: "Main Stadium",
    description: "Trial session for U-16 players. Full kit required. Bring water bottles and shin guards.",
    status: "Pending",
    created_by: 1
  },
  showcase: {
    title: "Annual Player Showcase",
    type: "Showcase",
    event_date: "2024-03-15T16:00:00.000Z",
    event_time: "4:00 PM",
    location: "Academy Hall",
    description: "Annual showcase event to display academy talent to scouts and parents. All age groups welcome.",
    status: "Pending",
    created_by: 1
  },
  guestSession: {
    title: "Guest Coach Session with Professional Player",
    type: "GuestSessions",
    event_date: "2024-03-10T10:00:00.000Z",
    event_time: "10:00 AM",
    location: "Training Field 2",
    description: "Special session with guest coach from Manchester United Academy. Focus on advanced techniques.",
    status: "Pending",
    created_by: 1
  },
  training: {
    title: "Weekly Training Session",
    type: "training",
    event_date: "2024-03-05T17:00:00.000Z",
    event_time: "5:00 PM",
    location: "Training Field 1",
    description: "Regular weekly training session focusing on fitness and basic skills.",
    status: "Pending",
    created_by: 1
  },
  match: {
    title: "Inter-Academy Match",
    type: "match",
    event_date: "2024-03-20T15:00:00.000Z",
    event_time: "3:00 PM",
    location: "Main Stadium",
    description: "Friendly match against City Academy. All academy players welcome to watch.",
    status: "Pending",
    created_by: 1
  },
  completedEvent: {
    title: "Completed Training Session",
    type: "training",
    event_date: "2024-02-28T17:00:00.000Z",
    event_time: "5:00 PM",
    location: "Training Field 1",
    description: "Completed training session from last week.",
    status: "Complete",
    created_by: 1
  }
};

// Test functions
async function testGetAllEvents() {
  console.log('🧪 Testing GET /api/admin/events (All Events)...');
  try {
    const response = await fetch(`${BASE_URL}/admin/events`);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ GET all events successful!');
      return data.events || [];
    } else {
      console.log('❌ GET all events failed!');
      return [];
    }
  } catch (error) {
    console.error('❌ Error testing GET all events:', error.message);
    return [];
  }
}

async function testCreateEvent(eventData, eventName) {
  console.log(`\n🧪 Testing POST /api/admin/events (${eventName})...`);
  try {
    const response = await fetch(`${BASE_URL}/admin/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log(`✅ ${eventName} creation successful!`);
      return data.event?.event_id;
    } else {
      console.log(`❌ ${eventName} creation failed!`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error creating ${eventName}:`, error.message);
    return null;
  }
}

async function testGetEventById(eventId) {
  console.log(`\n🧪 Testing GET /api/admin/events/${eventId}...`);
  try {
    const response = await fetch(`${BASE_URL}/admin/events/${eventId}`);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ GET event by ID successful!');
      return data.event;
    } else {
      console.log('❌ GET event by ID failed!');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting event by ID:', error.message);
    return null;
  }
}

async function testUpdateEvent(eventId, updateData) {
  console.log(`\n🧪 Testing PUT /api/admin/events/${eventId}...`);
  try {
    const response = await fetch(`${BASE_URL}/admin/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Event update successful!');
      return data.event;
    } else {
      console.log('❌ Event update failed!');
      return null;
    }
  } catch (error) {
    console.error('❌ Error updating event:', error.message);
    return null;
  }
}

async function testFilterEvents() {
  console.log('\n🧪 Testing Event Filtering...');
  
  // Test filter by status
  console.log('\n📋 Testing filter by status (Pending)...');
  try {
    const response = await fetch(`${BASE_URL}/admin/events?status=Pending`);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Pending Events:', data.events?.length || 0);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Filter by status successful!');
    } else {
      console.log('❌ Filter by status failed!');
    }
  } catch (error) {
    console.error('❌ Error filtering by status:', error.message);
  }

  // Test filter by type
  console.log('\n📋 Testing filter by type (Trial)...');
  try {
    const response = await fetch(`${BASE_URL}/admin/events?type=Trial`);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Trial Events:', data.events?.length || 0);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Filter by type successful!');
    } else {
      console.log('❌ Filter by type failed!');
    }
  } catch (error) {
    console.error('❌ Error filtering by type:', error.message);
  }
}

async function testErrorCases() {
  console.log('\n🧪 Testing Error Cases...');
  
  // Test missing required fields
  console.log('\n❌ Testing missing required fields...');
  try {
    const response = await fetch(`${BASE_URL}/admin/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: "Incomplete Event"
        // Missing type, event_date, created_by
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 400) {
      console.log('✅ Missing required fields validation working!');
    } else {
      console.log('❌ Missing required fields validation not working!');
    }
  } catch (error) {
    console.error('❌ Error testing missing fields:', error.message);
  }

  // Test invalid event ID
  console.log('\n❌ Testing invalid event ID...');
  try {
    const response = await fetch(`${BASE_URL}/admin/events/99999`);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 404) {
      console.log('✅ Invalid ID handling working!');
    } else {
      console.log('❌ Invalid ID handling not working!');
    }
  } catch (error) {
    console.error('❌ Error testing invalid ID:', error.message);
  }
}

// Main test function
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Events API Tests...\n');
  console.log('Testing API at:', BASE_URL);
  console.log('Make sure your Vercel deployment is working!\n');

  let createdEventIds = [];

  try {
    // Test 1: Get all events (should be empty initially)
    await testGetAllEvents();

    // Test 2: Create different types of events
    console.log('\n📝 Creating sample events...');
    
    for (const [eventName, eventData] of Object.entries(sampleEvents)) {
      const eventId = await testCreateEvent(eventData, eventName);
      if (eventId) {
        createdEventIds.push(eventId);
      }
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test 3: Get all events again (should have created events)
    console.log('\n📋 Getting all events after creation...');
    const allEvents = await testGetAllEvents();
    console.log(`Total events found: ${allEvents.length}`);

    // Test 4: Get specific event by ID
    if (createdEventIds.length > 0) {
      await testGetEventById(createdEventIds[0]);
    }

    // Test 5: Update an event
    if (createdEventIds.length > 0) {
      const updateData = {
        title: "Updated Event Title",
        description: "This event has been updated with new information.",
        status: "Complete"
      };
      await testUpdateEvent(createdEventIds[0], updateData);
    }

    // Test 6: Test filtering
    await testFilterEvents();

    // Test 7: Test error cases
    await testErrorCases();

    console.log('\n🎉 All tests completed!');
    console.log(`Created ${createdEventIds.length} events successfully.`);
    
    if (createdEventIds.length > 0) {
      console.log('\n📋 Sample Event IDs created:');
      createdEventIds.forEach((id, index) => {
        console.log(`${index + 1}. Event ID: ${id}`);
      });
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run tests
runComprehensiveTests();
