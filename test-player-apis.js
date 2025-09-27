// Test script for Player Profile and Reels APIs
// Run with: node test-player-apis.js

const BASE_URL = 'https://quicktouch02.vercel.app/api';

// Sample data for testing
const sampleProfileUpdate = {
  player_id: 1, // You'll need to get a valid player ID from your database
  age: 18,
  height_cm: 175,
  position: "Midfielder",
  weight_kg: 70,
  preferred_foot: "Right"
};

const sampleReel = {
  player_id: 1, // You'll need to get a valid player ID from your database
  academy_id: 1, // You'll need to get a valid academy ID from your database
  video_url: "https://example.com/player-reel.mp4",
  title: "My Best Goals - Season 2024"
};

const sampleReels = [
  {
    player_id: 1,
    academy_id: 1,
    video_url: "https://example.com/goals-compilation.mp4",
    title: "Goal Compilation - 2024 Season"
  },
  {
    player_id: 1,
    academy_id: 1,
    video_url: "https://example.com/skills-showcase.mp4",
    title: "Skills Showcase - Training Session"
  },
  {
    player_id: 1,
    academy_id: 1,
    video_url: "https://example.com/match-highlights.mp4",
    title: "Match Highlights - vs City Academy"
  }
];

async function testPlayerProfileAPI() {
  console.log('🧪 Testing Player Profile API...\n');

  try {
    // Test 1: Get player profile
    console.log('1️⃣ Testing GET player profile...');
    const response1 = await fetch(`${BASE_URL}/players/profile?user_id=1`);
    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(result1, null, 2));
    
    if (response1.ok) {
      console.log('✅ GET player profile successful!\n');
    } else {
      console.log('❌ GET player profile failed!\n');
    }

    // Test 2: Update player profile
    console.log('2️⃣ Testing PUT player profile...');
    const response2 = await fetch(`${BASE_URL}/players/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleProfileUpdate)
    });

    const result2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Response:', JSON.stringify(result2, null, 2));
    
    if (response2.ok) {
      console.log('✅ PUT player profile successful!\n');
    } else {
      console.log('❌ PUT player profile failed!\n');
    }

  } catch (error) {
    console.error('❌ Player Profile API test failed:', error.message);
  }
}

async function testPlayerReelsAPI() {
  console.log('🧪 Testing Player Reels API...\n');

  let createdReelIds = [];

  try {
    // Test 1: Create player reel
    console.log('1️⃣ Testing POST create player reel...');
    const response1 = await fetch(`${BASE_URL}/players/reels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleReel)
    });

    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(result1, null, 2));
    
    if (response1.ok) {
      console.log('✅ POST create player reel successful!\n');
      const reelId = result1.reel?.reel_id;
      if (reelId) {
        createdReelIds.push(reelId);
      }
    } else {
      console.log('❌ POST create player reel failed!\n');
    }

    // Test 2: Create multiple reels
    console.log('2️⃣ Testing POST create multiple reels...');
    for (const reelData of sampleReels) {
      const response = await fetch(`${BASE_URL}/players/reels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reelData)
      });

      const result = await response.json();
      console.log(`Status for "${reelData.title}":`, response.status);
      
      if (response.ok) {
        const reelId = result.reel?.reel_id;
        if (reelId) {
          createdReelIds.push(reelId);
        }
        console.log('✅ Created successfully');
      } else {
        console.log('❌ Failed:', result.error);
      }
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test 3: Get all reels
    console.log('\n3️⃣ Testing GET all player reels...');
    const response3 = await fetch(`${BASE_URL}/players/reels`);
    const result3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Total reels found:', result3.reels?.length || 0);
    console.log('Response:', JSON.stringify(result3, null, 2));
    
    if (response3.ok) {
      console.log('✅ GET all player reels successful!\n');
    } else {
      console.log('❌ GET all player reels failed!\n');
    }

    // Test 4: Get reels by player
    console.log('4️⃣ Testing GET reels by player...');
    const response4 = await fetch(`${BASE_URL}/players/reels?player_id=1`);
    const result4 = await response4.json();
    console.log('Status:', response4.status);
    console.log('Player reels found:', result4.reels?.length || 0);
    
    if (response4.ok) {
      console.log('✅ GET reels by player successful!\n');
    } else {
      console.log('❌ GET reels by player failed!\n');
    }

    // Test 5: Get reels by academy
    console.log('5️⃣ Testing GET reels by academy...');
    const response5 = await fetch(`${BASE_URL}/players/reels?academy_id=1`);
    const result5 = await response5.json();
    console.log('Status:', response5.status);
    console.log('Academy reels found:', result5.reels?.length || 0);
    
    if (response5.ok) {
      console.log('✅ GET reels by academy successful!\n');
    } else {
      console.log('❌ GET reels by academy failed!\n');
    }

    // Test 6: Get specific reel by ID
    if (createdReelIds.length > 0) {
      console.log('6️⃣ Testing GET specific reel by ID...');
      const response6 = await fetch(`${BASE_URL}/players/reels/${createdReelIds[0]}`);
      const result6 = await response6.json();
      console.log('Status:', response6.status);
      console.log('Response:', JSON.stringify(result6, null, 2));
      
      if (response6.ok) {
        console.log('✅ GET specific reel successful!\n');
      } else {
        console.log('❌ GET specific reel failed!\n');
      }

      // Test 7: Update reel
      console.log('7️⃣ Testing PUT update reel...');
      const updateData = {
        title: "Updated Reel Title",
        video_url: "https://example.com/updated-reel.mp4"
      };
      
      const response7 = await fetch(`${BASE_URL}/players/reels/${createdReelIds[0]}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const result7 = await response7.json();
      console.log('Status:', response7.status);
      console.log('Response:', JSON.stringify(result7, null, 2));
      
      if (response7.ok) {
        console.log('✅ PUT update reel successful!\n');
      } else {
        console.log('❌ PUT update reel failed!\n');
      }
    }

  } catch (error) {
    console.error('❌ Player Reels API test failed:', error.message);
  }

  return createdReelIds;
}

async function testErrorCases() {
  console.log('🧪 Testing Error Cases...\n');

  try {
    // Test 1: Missing required fields for profile update
    console.log('1️⃣ Testing missing required fields for profile update...');
    const response1 = await fetch(`${BASE_URL}/players/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Missing player_id
        age: 18,
        height_cm: 175
      })
    });

    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(result1, null, 2));
    
    if (response1.status === 400) {
      console.log('✅ Missing required fields validation working!\n');
    } else {
      console.log('❌ Missing required fields validation not working!\n');
    }

    // Test 2: Invalid age
    console.log('2️⃣ Testing invalid age...');
    const response2 = await fetch(`${BASE_URL}/players/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        player_id: 1,
        age: 100, // Invalid age
        height_cm: 175
      })
    });

    const result2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Response:', JSON.stringify(result2, null, 2));
    
    if (response2.status === 400) {
      console.log('✅ Invalid age validation working!\n');
    } else {
      console.log('❌ Invalid age validation not working!\n');
    }

    // Test 3: Invalid position
    console.log('3️⃣ Testing invalid position...');
    const response3 = await fetch(`${BASE_URL}/players/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        player_id: 1,
        position: "InvalidPosition"
      })
    });

    const result3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Response:', JSON.stringify(result3, null, 2));
    
    if (response3.status === 400) {
      console.log('✅ Invalid position validation working!\n');
    } else {
      console.log('❌ Invalid position validation not working!\n');
    }

    // Test 4: Missing required fields for reel creation
    console.log('4️⃣ Testing missing required fields for reel creation...');
    const response4 = await fetch(`${BASE_URL}/players/reels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Missing required fields
        title: "Test Reel"
      })
    });

    const result4 = await response4.json();
    console.log('Status:', response4.status);
    console.log('Response:', JSON.stringify(result4, null, 2));
    
    if (response4.status === 400) {
      console.log('✅ Missing required fields validation working!\n');
    } else {
      console.log('❌ Missing required fields validation not working!\n');
    }

    // Test 5: Invalid video URL
    console.log('5️⃣ Testing invalid video URL...');
    const response5 = await fetch(`${BASE_URL}/players/reels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        player_id: 1,
        academy_id: 1,
        video_url: "invalid-url",
        title: "Test Reel"
      })
    });

    const result5 = await response5.json();
    console.log('Status:', response5.status);
    console.log('Response:', JSON.stringify(result5, null, 2));
    
    if (response5.status === 400) {
      console.log('✅ Invalid URL validation working!\n');
    } else {
      console.log('❌ Invalid URL validation not working!\n');
    }

    // Test 6: Invalid reel ID
    console.log('6️⃣ Testing invalid reel ID...');
    const response6 = await fetch(`${BASE_URL}/players/reels/99999`);
    const result6 = await response6.json();
    console.log('Status:', response6.status);
    console.log('Response:', JSON.stringify(result6, null, 2));
    
    if (response6.status === 404) {
      console.log('✅ Invalid ID handling working!\n');
    } else {
      console.log('❌ Invalid ID handling not working!\n');
    }

  } catch (error) {
    console.error('❌ Error case test failed:', error.message);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Player APIs Tests...\n');
  console.log('Testing APIs at:', BASE_URL);
  console.log('Make sure your Vercel deployment is working!\n');

  try {
    // Test Player Profile API
    await testPlayerProfileAPI();

    // Test Player Reels API
    const createdReelIds = await testPlayerReelsAPI();

    // Test Error Cases
    await testErrorCases();

    console.log('🎉 All tests completed!');
    
    if (createdReelIds.length > 0) {
      console.log('\n📋 Sample Reel IDs created:');
      createdReelIds.forEach((id, index) => {
        console.log(`${index + 1}. Reel ID: ${id}`);
      });
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run tests
runTests();
