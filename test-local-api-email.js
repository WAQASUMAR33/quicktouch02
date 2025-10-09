const http = require('http');

async function testLocalAPI() {
  console.log('\n📧 Testing Email via Local Next.js API...\n');
  console.log('Make sure your dev server is running (npm run dev)\n');

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/test/send-test-email',
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
        console.log('Response Status:', res.statusCode);
        console.log('Response Headers:', res.headers);
        console.log('\nResponse Body:');
        
        try {
          const json = JSON.parse(data);
          console.log(JSON.stringify(json, null, 2));
          
          if (json.success) {
            console.log('\n✅ Email sent successfully!');
            console.log('📬 Check theitxprts786@gmail.com inbox\n');
            resolve(json);
          } else {
            console.log('\n❌ Email sending failed');
            console.log('Error:', json.error);
            console.log('Details:', json.details);
            reject(new Error(json.error));
          }
        } catch (e) {
          console.log(data);
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      console.error('\n💡 Make sure:');
      console.error('   1. Dev server is running (npm run dev)');
      console.error('   2. Server is on port 3000');
      console.error('   3. .env file has all email variables\n');
      reject(error);
    });

    req.write(JSON.stringify({ email: 'theitxprts786@gmail.com' }));
    req.end();
  });
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  QuickTouch Academy - Local Email Test');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

testLocalAPI()
  .then(() => {
    console.log('🎉 Test completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed');
    process.exit(1);
  });

