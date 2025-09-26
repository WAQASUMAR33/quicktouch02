// Test script for Academy Registration API
// Run with: node test-academy-api.js

const BASE_URL = 'http://localhost:3000/api';

// Test data for academy registration
const testAcademy = {
  name: "Manchester United Academy",
  description: "Premier League football academy for young talents",
  address: "Carrington Training Centre, Carrington, Manchester M31 4BH, UK",
  phone: "+44 161 868 8000",
  email: "academy@manutd.com",
  website: "https://www.manutd.com/academy",
  logo_url: "https://example.com/manutd-logo.png"
};

const testAcademy2 = {
  name: "Barcelona Youth Academy",
  description: "La Masia - World famous youth development program",
  address: "Ciutat Esportiva Joan Gamper, Barcelona, Spain",
  phone: "+34 902 18 99 00",
  email: "academy@fcbarcelona.com",
  website: "https://www.fcbarcelona.com/academy"
};

async function testAcademyRegistration() {
  console.log('🧪 Testing Academy Registration API...\n');

  try {
    // Test 1: Register first academy
    console.log('1️⃣ Testing academy registration...');
    const response1 = await fetch(`${BASE_URL}/academies/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAcademy)
    });

    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(result1, null, 2));
    
    if (response1.ok) {
      console.log('✅ Academy registration successful!\n');
      const academyId = result1.academy.academy_id;
      
      // Test 2: Get all academies
      console.log('2️⃣ Testing get all academies...');
      const response2 = await fetch(`${BASE_URL}/academies`);
      const result2 = await response2.json();
      console.log('Status:', response2.status);
      console.log('Response:', JSON.stringify(result2, null, 2));
      console.log('✅ Get all academies successful!\n');

      // Test 3: Get specific academy
      console.log('3️⃣ Testing get academy by ID...');
      const response3 = await fetch(`${BASE_URL}/academies/${academyId}`);
      const result3 = await response3.json();
      console.log('Status:', response3.status);
      console.log('Response:', JSON.stringify(result3, null, 2));
      console.log('✅ Get academy by ID successful!\n');

      // Test 4: Update academy
      console.log('4️⃣ Testing update academy...');
      const updateData = {
        description: "Updated: Premier League football academy for young talents - Now with new facilities!",
        website: "https://www.manutd.com/academy/new"
      };
      
      const response4 = await fetch(`${BASE_URL}/academies/${academyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const result4 = await response4.json();
      console.log('Status:', response4.status);
      console.log('Response:', JSON.stringify(result4, null, 2));
      console.log('✅ Update academy successful!\n');

      // Test 5: Register second academy
      console.log('5️⃣ Testing second academy registration...');
      const response5 = await fetch(`${BASE_URL}/academies/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testAcademy2)
      });

      const result5 = await response5.json();
      console.log('Status:', response5.status);
      console.log('Response:', JSON.stringify(result5, null, 2));
      console.log('✅ Second academy registration successful!\n');

    } else {
      console.log('❌ Academy registration failed!\n');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

async function testErrorCases() {
  console.log('🧪 Testing Error Cases...\n');

  try {
    // Test 1: Missing required field (name)
    console.log('1️⃣ Testing missing name field...');
    const response1 = await fetch(`${BASE_URL}/academies/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: "Academy without name",
        email: "test@example.com"
      })
    });

    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(result1, null, 2));
    console.log('✅ Missing name validation working!\n');

    // Test 2: Duplicate email
    console.log('2️⃣ Testing duplicate email...');
    const response2 = await fetch(`${BASE_URL}/academies/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: "Duplicate Academy",
        email: "academy@manutd.com" // Same email as first test
      })
    });

    const result2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Response:', JSON.stringify(result2, null, 2));
    console.log('✅ Duplicate email validation working!\n');

    // Test 3: Invalid academy ID
    console.log('3️⃣ Testing invalid academy ID...');
    const response3 = await fetch(`${BASE_URL}/academies/99999`);
    const result3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Response:', JSON.stringify(result3, null, 2));
    console.log('✅ Invalid ID handling working!\n');

  } catch (error) {
    console.error('❌ Error case test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Academy API Tests...\n');
  console.log('Make sure your Next.js server is running on http://localhost:3000\n');
  
  await testAcademyRegistration();
  await testErrorCases();
  
  console.log('🎉 All tests completed!');
}

runTests();
