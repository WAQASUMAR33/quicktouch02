const API_BASE_URL = 'http://localhost:3000/api';

// Test data for player registration
const testPlayers = [
  {
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
  },
  {
    full_name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1234567891",
    password: "password123",
    academy_id: 1,
    age: 16,
    height_cm: 165,
    weight_kg: 55,
    position: "Forward",
    preferred_foot: "Left"
  },
  {
    full_name: "Mohammed Ali",
    email: "mohammed.ali@example.com",
    phone: "+1234567892",
    password: "password123",
    academy_id: 2,
    age: 20,
    height_cm: 180,
    weight_kg: 75,
    position: "Defender",
    preferred_foot: "Right"
  }
];

async function testPlayerRegistration() {
  console.log('🧪 Testing Player Registration API\n');

  try {
    // Test 1: Get registration form data
    console.log('📋 Test 1: Getting registration form data...');
    const formDataResponse = await fetch(`${API_BASE_URL}/players/register`);
    const formData = await formDataResponse.json();
    
    if (formDataResponse.ok) {
      console.log('✅ Registration form data retrieved successfully');
      console.log('📊 Available academies:', formData.academies?.length || 0);
      console.log('⚽ Available positions:', formData.positions?.length || 0);
      console.log('🦶 Preferred foot options:', formData.preferredFootOptions);
      console.log('📏 Validation rules:', formData.validationRules);
    } else {
      console.log('❌ Failed to get form data:', formData.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Register players
    for (let i = 0; i < testPlayers.length; i++) {
      const player = testPlayers[i];
      console.log(`👤 Test ${i + 2}: Registering player - ${player.full_name}`);
      
      const response = await fetch(`${API_BASE_URL}/players/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(player)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Player registered successfully');
        console.log('🆔 User ID:', result.user.userId);
        console.log('🏷️ Player ID:', result.playerProfile.playerId);
        console.log('🎫 Token:', result.token.substring(0, 20) + '...');
        console.log('📧 Email:', result.user.email);
        console.log('⚽ Position:', result.playerProfile.position);
        console.log('🦶 Preferred Foot:', result.playerProfile.preferredFoot);
      } else {
        console.log('❌ Registration failed:', result.error);
        if (result.details) {
          console.log('📝 Details:', result.details);
        }
      }

      console.log('\n' + '-'.repeat(30) + '\n');
    }

    // Test 3: Test validation errors
    console.log('🔍 Test 5: Testing validation errors...');
    
    const invalidPlayer = {
      full_name: "Test Player",
      email: "invalid-email", // Invalid email
      password: "123", // Too short
      age: 100, // Invalid age
      height_cm: 50, // Invalid height
      weight_kg: 5, // Invalid weight
      position: "Invalid Position", // Invalid position
      preferred_foot: "Both" // Invalid foot
    };

    const validationResponse = await fetch(`${API_BASE_URL}/players/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidPlayer)
    });

    const validationResult = await validationResponse.json();

    if (!validationResponse.ok) {
      console.log('✅ Validation working correctly');
      console.log('❌ Expected error:', validationResult.error);
    } else {
      console.log('❌ Validation should have failed but didn\'t');
    }

    // Test 4: Test duplicate email
    console.log('\n🔍 Test 6: Testing duplicate email...');
    
    const duplicateResponse = await fetch(`${API_BASE_URL}/players/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPlayers[0]) // Same email as first player
    });

    const duplicateResult = await duplicateResponse.json();

    if (!duplicateResponse.ok) {
      console.log('✅ Duplicate email validation working');
      console.log('❌ Error:', duplicateResult.error);
    } else {
      console.log('❌ Duplicate email should have been rejected');
    }

  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

// Run the tests
testPlayerRegistration();
