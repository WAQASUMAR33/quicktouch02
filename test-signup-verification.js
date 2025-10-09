// Test Academy Signup with Email Verification
const { sendVerificationEmail } = require('./src/lib/email.js');
require('dotenv').config();

console.log('🧪 Testing Academy Signup Email Verification Flow\n');
console.log('=' .repeat(60));

async function testSignupVerification() {
  try {
    // Simulate academy registration data
    const testAcademy = {
      name: 'Elite Football Academy',
      email: 'theitxprts786@gmail.com',
      phone: '+92 300 1234567'
    };
    
    // Generate a verification token (simulating what the API does)
    const crypto = require('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    console.log('📝 Academy Registration Details:');
    console.log('   Name:', testAcademy.name);
    console.log('   Email:', testAcademy.email);
    console.log('   Phone:', testAcademy.phone);
    console.log('   Verification Token:', verificationToken);
    console.log('\n' + '=' .repeat(60));
    
    console.log('\n📧 Sending Verification Email...\n');
    
    const result = await sendVerificationEmail(
      testAcademy.email,
      testAcademy.name,
      verificationToken
    );
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ SUCCESS! Verification Email Sent!\n');
    console.log('📨 Email Details:');
    console.log('   Message ID:', result.messageId);
    console.log('   Recipient:', testAcademy.email);
    console.log('   Subject: Verify Your Email - QuickTouch Academy');
    
    console.log('\n🔗 Verification Link:');
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/academy/verify-email?token=${verificationToken}`;
    console.log('   ' + verificationUrl);
    
    console.log('\n📬 Next Steps:');
    console.log('   1. Check inbox: theitxprts786@gmail.com');
    console.log('   2. Look for email from: noreply@rapidtechpro.com');
    console.log('   3. Subject: "Verify Your Email - QuickTouch Academy"');
    console.log('   4. Click the verification button in the email');
    console.log('   5. Or copy the verification link above');
    
    console.log('\n⚠️  Note: Check spam folder if not in inbox!');
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Test completed successfully!\n');
    
  } catch (error) {
    console.error('\n' + '=' .repeat(60));
    console.error('❌ TEST FAILED!\n');
    console.error('Error:', error.message);
    console.error('\n📋 Full Error Details:');
    console.error(error);
    console.error('\n' + '=' .repeat(60));
    process.exit(1);
  }
}

testSignupVerification();

