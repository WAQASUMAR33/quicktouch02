require('dotenv').config();

async function testSendGrid() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  SendGrid Configuration Test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check environment variables
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  console.log('📋 Environment Variables:');
  console.log('  SENDGRID_API_KEY:', apiKey ? `✅ SET (${apiKey.substring(0, 10)}...)` : '❌ NOT SET');
  console.log('  SENDGRID_FROM_EMAIL:', fromEmail || '❌ NOT SET');
  console.log('  NEXT_PUBLIC_APP_URL:', appUrl || '❌ NOT SET');
  console.log('');

  if (!apiKey) {
    console.log('❌ SENDGRID_API_KEY is not set!\n');
    console.log('📝 To fix:');
    console.log('1. Sign up at https://sendgrid.com');
    console.log('2. Get API key from Settings → API Keys');
    console.log('3. Add to .env file:');
    console.log('   SENDGRID_API_KEY=SG.your_api_key_here');
    console.log('4. Verify sender email in SendGrid dashboard');
    console.log('5. Add SENDGRID_FROM_EMAIL=noreply@rapidtechpro.com');
    console.log('');
    return;
  }

  // Test via API endpoint
  console.log('🧪 Testing SendGrid via API endpoint...\n');
  console.log('Make sure your dev server is running (npm run dev)\n');

  const http = require('http');

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/test/send-email-sendgrid',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('📨 Response Status:', res.statusCode);
        console.log('');

        try {
          const json = JSON.parse(data);
          console.log('Response:');
          console.log(JSON.stringify(json, null, 2));
          console.log('');

          if (json.success) {
            console.log('✅ SUCCESS! Email sent via SendGrid!\n');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 Email Details:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('To: theitxprts786@gmail.com');
            console.log('Status:', json.details.statusCode);
            console.log('Message ID:', json.details.messageId);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('\n📬 Check your inbox at theitxprts786@gmail.com!');
            console.log('   Subject: ✅ SendGrid Test Email - QuickTouch Academy');
            console.log('   (Also check Spam/Promotions folders)\n');
            console.log('🎉 SendGrid is working! Email system is ready!\n');
            resolve(json);
          } else {
            console.log('❌ Failed to send email\n');
            console.log('Error:', json.error);
            console.log('Details:', json.details);
            console.log('');
            
            if (json.details?.response?.errors) {
              console.log('SendGrid Errors:');
              json.details.response.errors.forEach(err => {
                console.log('  -', err.message);
              });
              console.log('');
            }

            if (json.help) {
              console.log('💡 Troubleshooting:');
              Object.entries(json.help).forEach(([key, value]) => {
                console.log('  -', value);
              });
              console.log('');
            }
            
            reject(new Error(json.error));
          }
        } catch (e) {
          console.log('Raw Response:', data);
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      console.error('\n💡 Make sure:');
      console.error('   1. Dev server is running (npm run dev)');
      console.error('   2. Server is on port 3000');
      console.error('   3. SENDGRID_API_KEY is in .env file\n');
      reject(error);
    });

    req.write(JSON.stringify({ email: 'theitxprts786@gmail.com' }));
    req.end();
  });
}

testSendGrid()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

