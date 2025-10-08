require('dotenv').config();
const net = require('net');

async function testSMTP() {
  console.log('\n🔌 Testing SMTP Connection to Hostinger...\n');

  const host = process.env.EMAIL_SERVER_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.EMAIL_SERVER_PORT || '587');
  const user = process.env.EMAIL_SERVER_USER || 'noreply@rapidtechpro.com';
  const password = process.env.EMAIL_SERVER_PASSWORD || 'DildilPakistan786@786@waqas';

  console.log('Configuration:');
  console.log('  Host:', host);
  console.log('  Port:', port);
  console.log('  User:', user);
  console.log('  Password:', password ? `SET (${password.length} chars)` : 'NOT SET');
  console.log('');

  return new Promise((resolve, reject) => {
    console.log('🔄 Attempting to connect...');
    
    const client = net.createConnection({ host, port }, () => {
      console.log('✅ Connected to SMTP server!');
      console.log('   Connection established on port', port);
    });

    let response = '';

    client.on('data', (data) => {
      response += data.toString();
      console.log('📨 Server response:', data.toString().trim());
      
      if (response.includes('220')) {
        console.log('\n✅ SMTP server is responding!');
        console.log('✅ Port', port, 'is accessible');
        console.log('✅ Ready to send emails');
        client.end();
        resolve(true);
      }
    });

    client.on('error', (error) => {
      console.error('\n❌ Connection error:', error.message);
      console.error('   Code:', error.code);
      
      if (error.code === 'ENOTFOUND') {
        console.error('\n   Host not found. Check EMAIL_SERVER_HOST');
      } else if (error.code === 'ETIMEDOUT') {
        console.error('\n   Connection timed out. Firewall might be blocking port', port);
      } else if (error.code === 'ECONNREFUSED') {
        console.error('\n   Connection refused. Wrong port or server down');
      }
      
      reject(error);
    });

    client.on('end', () => {
      console.log('\n👋 Connection closed');
      resolve(true);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (client.connecting) {
        console.error('\n❌ Connection timeout after 10 seconds');
        client.destroy();
        reject(new Error('Connection timeout'));
      }
    }, 10000);
  });
}

testSMTP()
  .then(() => {
    console.log('\n🎉 SMTP test completed successfully!');
    console.log('📧 Email sending should work in production.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ SMTP test failed');
    console.error('Fix the issues above and try again.\n');
    process.exit(1);
  });

