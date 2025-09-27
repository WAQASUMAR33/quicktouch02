// Script to add sample events to the database
// Run with: node add-sample-events.js

const BASE_URL = 'https://quicktouch02.vercel.app/api';

// Sample events data
const sampleEvents = [
  {
    title: "U-16 Training Session",
    type: "training",
    event_date: "2024-03-01T17:00:00.000Z",
    location: "Training Field 1",
    description: "Regular training session for U-16 players. Focus on passing and shooting drills.",
    created_by: 1
  },
  {
    title: "U-18 Trial Session",
    type: "trial",
    event_date: "2024-03-05T14:00:00.000Z",
    location: "Main Stadium",
    description: "Trial session for U-18 players. Full kit required. Bring water bottles.",
    created_by: 1
  },
  {
    title: "Academy vs City Academy",
    type: "match",
    event_date: "2024-03-10T15:00:00.000Z",
    location: "Main Stadium",
    description: "Friendly match against City Academy. All academy players welcome to watch.",
    created_by: 1
  },
  {
    title: "Player Showcase Event",
    type: "showcase",
    event_date: "2024-03-15T16:00:00.000Z",
    location: "Academy Hall",
    description: "Annual showcase event to display academy talent to scouts and parents.",
    created_by: 1
  },
  {
    title: "U-14 Training Session",
    type: "training",
    event_date: "2024-03-08T16:30:00.000Z",
    location: "Training Field 2",
    description: "Training session for U-14 players. Focus on basic skills and teamwork.",
    created_by: 1
  },
  {
    title: "Goalkeeper Training",
    type: "training",
    event_date: "2024-03-12T18:00:00.000Z",
    location: "Training Field 1",
    description: "Specialized goalkeeper training session. Open to all academy goalkeepers.",
    created_by: 1
  },
  {
    title: "U-16 Trial Session - Round 2",
    type: "trial",
    event_date: "2024-03-20T14:30:00.000Z",
    location: "Main Stadium",
    description: "Second round of U-16 trials. Selected players from first round.",
    created_by: 1
  },
  {
    title: "Academy Awards Night",
    type: "showcase",
    event_date: "2024-03-25T19:00:00.000Z",
    location: "Academy Hall",
    description: "Annual awards ceremony recognizing outstanding players and achievements.",
    created_by: 1
  },
  {
    title: "Fitness Testing Day",
    type: "training",
    event_date: "2024-03-18T10:00:00.000Z",
    location: "Training Field 1",
    description: "Comprehensive fitness testing for all academy players.",
    created_by: 1
  },
  {
    title: "Parents Meeting",
    type: "showcase",
    event_date: "2024-03-22T18:30:00.000Z",
    location: "Academy Hall",
    description: "Monthly parents meeting to discuss academy updates and player progress.",
    created_by: 1
  }
];

async function addSampleEvents() {
  console.log('🚀 Adding sample events to the database...\n');
  console.log(`Using API: ${BASE_URL}/admin/events-simple\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < sampleEvents.length; i++) {
    const event = sampleEvents[i];
    console.log(`${i + 1}. Adding event: "${event.title}"`);
    
    try {
      const response = await fetch(`${BASE_URL}/admin/events-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`   ✅ Success - Event ID: ${result.event?.event_id || 'N/A'}`);
        successCount++;
      } else {
        console.log(`   ❌ Failed - ${result.error}`);
        errorCount++;
      }

    } catch (error) {
      console.log(`   ❌ Error - ${error.message}`);
      errorCount++;
    }

    // Add delay between requests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('');
  }

  console.log('📊 Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📝 Total: ${sampleEvents.length}`);

  if (successCount > 0) {
    console.log('\n🎉 Sample events added successfully!');
    console.log('\nYou can now test the API:');
    console.log(`GET ${BASE_URL}/admin/events-simple`);
  }
}

// Function to test the API first
async function testAPI() {
  console.log('🧪 Testing API connection first...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/admin/events-simple`);
    const result = await response.json();

    if (response.ok) {
      console.log('✅ API is working correctly!');
      console.log(`Current events in database: ${result.events?.length || 0}`);
      console.log('');
      return true;
    } else {
      console.log('❌ API is not working:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to connect to API:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🎯 Sample Events Database Populator\n');
  console.log('This script will add sample events to your database using the simplified Events API.\n');

  // Test API first
  const apiWorking = await testAPI();
  
  if (!apiWorking) {
    console.log('❌ Cannot proceed - API is not working. Please check your deployment.');
    return;
  }

  // Ask for confirmation (in a real scenario, you might want to add this)
  console.log('📝 About to add the following types of events:');
  console.log('- Training Sessions (4 events)');
  console.log('- Trial Sessions (2 events)');
  console.log('- Match Events (1 event)');
  console.log('- Showcase Events (3 events)');
  console.log('');

  // Add the events
  await addSampleEvents();
}

// Run the script
main().catch(console.error);
