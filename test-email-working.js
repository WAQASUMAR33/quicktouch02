// Test email functionality locally
const { sendVerificationEmail } = require('./src/lib/email.js');
require('dotenv').config();

console.log('🧪 Testing Email Functionality\n');

async function testEmail() {
  try {
    console.log('📧 Sending test verification email...\n');
    
    const result = await sendVerificationEmail(
      'theitxprts786@gmail.com',
      'Test User',
      'test_token_12345'
    );
    
    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log('📨 Message ID:', result.messageId);
    console.log('\n🎉 Check your inbox: theitxprts786@gmail.com');
    console.log('   (Don\'t forget to check spam folder)');
    
  } catch (error) {
    console.error('\n❌ FAILED! Email could not be sent.');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
  }
}

testEmail();

