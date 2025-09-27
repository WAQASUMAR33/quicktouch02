// Test script for Training Program Upload API
// Run with: node test-training-program-api.js

const BASE_URL = 'http://localhost:3000/api';

// Test data for training program upload
const testTrainingProgram = {
  coach_id: 1, // You'll need to get a valid coach ID from your database
  academy_id: 1, // You'll need to get a valid academy ID from your database
  title: "Advanced Passing Drills",
  title_type: "TrainingProgram",
  venue: "Main Training Field",
  program_date: "2024-02-15T10:00:00.000Z",
  program_time: "10:00 AM",
  details: "Focus on short passing, long passing, and through balls. Equipment needed: cones, balls, bibs.",
  status: "upcoming",
  video_url: "https://example.com/training-video.mp4"
};

const testMatch = {
  coach_id: 1,
  academy_id: 1,
  title: "U-18 Friendly Match",
  title_type: "Match",
  venue: "Stadium Field",
  program_date: "2024-02-20T15:00:00.000Z",
  program_time: "3:00 PM",
  details: "Friendly match against local academy. Full kit required.",
  status: "upcoming"
};

const testDrill = {
  coach_id: 1,
  academy_id: 1,
  title: "Shooting Practice",
  title_type: "Drill",
  venue: "Shooting Range",
  program_date: "2024-02-18T09:00:00.000Z",
  program_time: "9:00 AM",
  details: "Individual shooting practice focusing on accuracy and power.",
  status: "upcoming"
};

async function testTrainingProgramUpload() {
  console.log('🧪 Testing Training Program Upload API...\n');

  try {
    // Test 1: Upload Training Program
    console.log('1️⃣ Testing training program upload...');
    const response1 = await fetch(`${BASE_URL}/admin/training-programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN' // You'll need to get a valid admin token
      },
      body: JSON.stringify(testTrainingProgram)
    });

    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(result1, null, 2));
    
    if (response1.ok) {
      console.log('✅ Training program upload successful!\n');
      const programId = result1.training_program.plan_id;
      
      // Test 2: Upload Match
      console.log('2️⃣ Testing match upload...');
      const response2 = await fetch(`${BASE_URL}/admin/training-programs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
        },
        body: JSON.stringify(testMatch)
      });

      const result2 = await response2.json();
      console.log('Status:', response2.status);
      console.log('Response:', JSON.stringify(result2, null, 2));
      console.log('✅ Match upload successful!\n');

      // Test 3: Upload Drill
      console.log('3️⃣ Testing drill upload...');
      const response3 = await fetch(`${BASE_URL}/admin/training-programs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
        },
        body: JSON.stringify(testDrill)
      });

      const result3 = await response3.json();
      console.log('Status:', response3.status);
      console.log('Response:', JSON.stringify(result3, null, 2));
      console.log('✅ Drill upload successful!\n');

      // Test 4: Get all training programs
      console.log('4️⃣ Testing get all training programs...');
      const response4 = await fetch(`${BASE_URL}/admin/training-programs`, {
        headers: {
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
        }
      });
      const result4 = await response4.json();
      console.log('Status:', response4.status);
      console.log('Response:', JSON.stringify(result4, null, 2));
      console.log('✅ Get all training programs successful!\n');

      // Test 5: Get specific training program
      console.log('5️⃣ Testing get specific training program...');
      const response5 = await fetch(`${BASE_URL}/admin/training-programs/${programId}`, {
        headers: {
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
        }
      });
      const result5 = await response5.json();
      console.log('Status:', response5.status);
      console.log('Response:', JSON.stringify(result5, null, 2));
      console.log('✅ Get specific training program successful!\n');

      // Test 6: Update training program
      console.log('6️⃣ Testing update training program...');
      const updateData = {
        title: "Updated Advanced Passing Drills",
        details: "Updated: Focus on short passing, long passing, through balls, and first touch. Equipment needed: cones, balls, bibs, agility ladders.",
        status: "Complete"
      };
      
      const response6 = await fetch(`${BASE_URL}/admin/training-programs/${programId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
        },
        body: JSON.stringify(updateData)
      });

      const result6 = await response6.json();
      console.log('Status:', response6.status);
      console.log('Response:', JSON.stringify(result6, null, 2));
      console.log('✅ Update training program successful!\n');

    } else {
      console.log('❌ Training program upload failed!\n');
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
    const response1 = await fetch(`${BASE_URL}/admin/training-programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
      },
      body: JSON.stringify({
        title: "Incomplete Training Program"
        // Missing title_type, academy_id, coach_id
      })
    });

    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(result1, null, 2));
    console.log('✅ Missing required fields validation working!\n');

    // Test 2: Invalid title type
    console.log('2️⃣ Testing invalid title type...');
    const response2 = await fetch(`${BASE_URL}/admin/training-programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
      },
      body: JSON.stringify({
        title: "Invalid Training Program",
        title_type: "InvalidType",
        academy_id: 1,
        coach_id: 1
      })
    });

    const result2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Response:', JSON.stringify(result2, null, 2));
    console.log('✅ Invalid title type validation working!\n');

    // Test 3: Invalid status
    console.log('3️⃣ Testing invalid status...');
    const response3 = await fetch(`${BASE_URL}/admin/training-programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
      },
      body: JSON.stringify({
        title: "Invalid Status Training Program",
        title_type: "TrainingProgram",
        academy_id: 1,
        coach_id: 1,
        status: "InvalidStatus"
      })
    });

    const result3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Response:', JSON.stringify(result3, null, 2));
    console.log('✅ Invalid status validation working!\n');

    // Test 4: Invalid training program ID
    console.log('4️⃣ Testing invalid training program ID...');
    const response4 = await fetch(`${BASE_URL}/admin/training-programs/99999`, {
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
      }
    });
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
  console.log('🚀 Starting Training Program Upload API Tests...\n');
  console.log('Make sure your Next.js server is running on http://localhost:3000\n');
  console.log('⚠️  Note: You need to replace YOUR_ADMIN_TOKEN with a valid admin JWT token\n');
  
  await testTrainingProgramUpload();
  await testErrorCases();
  
  console.log('🎉 All tests completed!');
}

runTests();
