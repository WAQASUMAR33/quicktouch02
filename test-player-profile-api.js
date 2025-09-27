// Test script for Player Profile API
// Run with: node test-player-profile-api.js

const BASE_URL = 'https://quicktouch02.vercel.app/api';

async function testPlayerProfileAPI() {
  console.log('🧪 Testing Player Profile API...\n');

  // Test 1: Check if player profile exists for user_id=1
  console.log('1. Testing GET /api/players/profile?user_id=1');
  try {
    const response = await fetch(`${BASE_URL}/players/profile?user_id=1`);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Profile found:', result.profile);
    } else {
      console.log('❌ Profile not found:', result.error);
      console.log('   Status:', response.status);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('');

  // Test 2: Try to create/update a player profile
  console.log('2. Testing PUT /api/players/profile (create/update)');
  const profileData = {
    player_id: 1, // Assuming player_id 1 exists
    age: 16,
    height_cm: 175,
    weight_kg: 65,
    position: "Midfielder",
    preferred_foot: "Right"
  };

  try {
    const response = await fetch(`${BASE_URL}/players/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Profile updated successfully:', result.profile);
    } else {
      console.log('❌ Update failed:', result.error);
      console.log('   Status:', response.status);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('');

  // Test 3: Test validation with invalid data
  console.log('3. Testing validation with invalid age');
  const invalidData = {
    player_id: 1,
    age: 60, // Invalid age (should be 5-50)
    height_cm: 175,
    position: "Midfielder"
  };

  try {
    const response = await fetch(`${BASE_URL}/players/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('⚠️  Validation failed - invalid data was accepted:', result);
    } else {
      console.log('✅ Validation working - invalid data rejected:', result.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('');

  // Test 4: Test validation with invalid position
  console.log('4. Testing validation with invalid position');
  const invalidPositionData = {
    player_id: 1,
    age: 16,
    height_cm: 175,
    position: "InvalidPosition", // Invalid position
    preferred_foot: "Right"
  };

  try {
    const response = await fetch(`${BASE_URL}/players/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidPositionData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('⚠️  Validation failed - invalid position was accepted:', result);
    } else {
      console.log('✅ Validation working - invalid position rejected:', result.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n📊 Player Profile API Test Complete!');
}

// Run the tests
testPlayerProfileAPI().catch(console.error);
