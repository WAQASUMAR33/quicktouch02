const API_BASE_URL = 'http://localhost:3001/api';

// Test data for login API
const testUsers = [
  {
    email: "john.smith@test.com",
    password: "password123",
    rememberMe: false
  },
  {
    email: "maria.garcia@test.com", 
    password: "password123",
    rememberMe: true
  },
  {
    email: "david.wilson@test.com",
    password: "password123",
    rememberMe: false
  }
];

async function testLoginAPI() {
  console.log('🔐 Testing Login API\n');

  try {
    // Test 1: Get login form data
    console.log('📋 Test 1: Getting login form data...');
    const formDataResponse = await fetch(`${API_BASE_URL}/auth/login`);
    const formData = await formDataResponse.json();
    
    if (formDataResponse.ok) {
      console.log('✅ Login form data retrieved successfully');
      console.log('📊 Validation rules:', formData.validationRules);
      console.log('🔧 Features:', formData.features);
      console.log('👥 Supported roles:', formData.supportedRoles);
    } else {
      console.log('❌ Failed to get form data:', formData.error);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Login with valid credentials
    for (let i = 0; i < testUsers.length; i++) {
      const user = testUsers[i];
      console.log(`👤 Test ${i + 2}: Logging in user - ${user.email}`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Login successful');
        console.log('🆔 User ID:', result.user.userId);
        console.log('📧 Email:', result.user.email);
        console.log('👤 Full Name:', result.user.fullName);
        console.log('🎭 Role:', result.user.role);
        console.log('📱 Phone:', result.user.phone || 'Not provided');
        console.log('🏢 Academy ID:', result.user.academyId || 'None');
        console.log('🎫 Token:', result.token.substring(0, 30) + '...');
        console.log('⏰ Expires In:', result.expiresIn);
        console.log('⚽ Player Profile:', result.user.playerProfile ? 'Available' : 'Not available');
      } else {
        console.log('❌ Login failed:', result.error);
        if (result.details) {
          console.log('📝 Details:', result.details);
        }
      }

      console.log('\n' + '-'.repeat(30) + '\n');
    }

    // Test 3: Test validation errors
    console.log('🔍 Test 5: Testing validation errors...');
    
    const invalidCredentials = [
      {
        email: "invalid-email",
        password: "123",
        description: "Invalid email format and short password"
      },
      {
        email: "test@example.com",
        password: "123",
        description: "Valid email but short password"
      },
      {
        email: "invalid-email-format",
        password: "password123",
        description: "Invalid email format"
      }
    ];

    for (const invalid of invalidCredentials) {
      console.log(`\n🔍 Testing: ${invalid.description}`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: invalid.email,
          password: invalid.password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.log('✅ Validation working correctly');
        console.log('❌ Expected error:', result.error);
      } else {
        console.log('❌ Validation should have failed but didn\'t');
      }
    }

    // Test 4: Test invalid credentials
    console.log('\n🔍 Test 6: Testing invalid credentials...');
    
    const invalidLogin = {
      email: "nonexistent@example.com",
      password: "wrongpassword"
    };

    const invalidResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidLogin)
    });

    const invalidResult = await invalidResponse.json();

    if (!invalidResponse.ok) {
      console.log('✅ Invalid credentials handled correctly');
      console.log('❌ Error:', invalidResult.error);
    } else {
      console.log('❌ Invalid credentials should have been rejected');
    }

    // Test 5: Test missing fields
    console.log('\n🔍 Test 7: Testing missing fields...');
    
    const missingFields = [
      { email: "test@example.com" }, // Missing password
      { password: "password123" },   // Missing email
      {}                             // Missing both
    ];

    for (const missing of missingFields) {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(missing)
      });

      const result = await response.json();

      if (!response.ok) {
        console.log('✅ Missing fields handled correctly');
        console.log('❌ Error:', result.error);
      } else {
        console.log('❌ Missing fields should have been rejected');
      }
    }

    console.log('\n🎉 All login API tests completed!');

  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

// Run the tests
testLoginAPI();
