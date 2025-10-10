// Quick test script for Academy Signup API
// Run with: node test-academy-signup-api.js

console.log('🧪 Testing Academy Signup API\n');
console.log('=' .repeat(60));

// Sample JSON input for academy registration
const sampleInput = {
  // Required fields
  name: "Elite Football Academy",
  email: "theitxprts786@gmail.com",  // Change this to test with different email
  password: "SecurePassword123!",
  
  // Optional fields
  phone: "+92 300 1234567",
  address: "123 Stadium Road, Karachi, Pakistan",
  description: "Premier football academy focused on developing young talent through professional coaching and modern training facilities.",
  website: "https://www.elitefootball.com"
};

console.log('📝 Sample Academy Registration Input:\n');
console.log(JSON.stringify(sampleInput, null, 2));
console.log('\n' + '=' .repeat(60));

async function testSignup() {
  try {
    console.log('\n📤 Sending registration request...\n');
    
    const response = await fetch('http://localhost:3000/api/auth/academy/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleInput)
    });

    const data = await response.json();

    console.log('📊 Response Status:', response.status);
    console.log('📦 Response Data:\n');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n' + '=' .repeat(60));

    if (response.ok) {
      console.log('\n✅ SUCCESS! Academy registered!\n');
      console.log('🎉 Registration Details:');
      console.log('   Academy ID:', data.academy?.academy_id);
      console.log('   Name:', data.academy?.name);
      console.log('   Email:', data.academy?.email);
      console.log('   Email Verified:', data.academy?.email_verified ? '✅' : '❌ (Pending)');
      console.log('\n📧 Verification Email:');
      console.log('   Check inbox:', data.academy?.email);
      console.log('   From: noreply@rapidtechpro.com');
      console.log('   Subject: Verify Your Email - QuickTouch Academy');
      console.log('\n⚠️  IMPORTANT: Verify email before logging in!');
    } else {
      console.log('\n❌ FAILED! Registration error\n');
      console.log('Error:', data.error);
      if (data.details) {
        console.log('Details:', data.details);
      }
    }

    console.log('\n' + '=' .repeat(60));

  } catch (error) {
    console.error('\n❌ Request failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Make sure your dev server is running: npm run dev');
  }
}

// Show sample inputs for different scenarios
console.log('\n\n📋 MORE SAMPLE INPUTS:\n');

console.log('1️⃣  MINIMAL INPUT (Only required fields):');
console.log(JSON.stringify({
  name: "Test Academy",
  email: "test@academy.com",
  password: "TestPass123"
}, null, 2));

console.log('\n2️⃣  WITH PHONE ONLY:');
console.log(JSON.stringify({
  name: "Sports Academy",
  email: "sports@academy.com",
  password: "SportsPass123",
  phone: "+92 321 9876543"
}, null, 2));

console.log('\n3️⃣  COMPLETE INPUT:');
console.log(JSON.stringify({
  name: "Professional Football Academy",
  email: "pro@football.com",
  password: "ProPass123!",
  phone: "+92 300 5555555",
  address: "456 Victory Lane, Lahore, Pakistan",
  description: "State-of-the-art football training facility with international standard pitches and experienced coaches.",
  website: "https://profootball.pk"
}, null, 2));

console.log('\n' + '=' .repeat(60));
console.log('\n🚀 Running test with sample input...\n');

// Run the test
testSignup();

