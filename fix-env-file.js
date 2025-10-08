const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

console.log('🔧 Checking .env file...\n');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Please create .env file from env.example');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');

console.log('Current email settings:');
console.log('- EMAIL_SERVER_HOST:', envContent.includes('EMAIL_SERVER_HOST') ? '✅' : '❌');
console.log('- EMAIL_SERVER_PORT:', envContent.includes('EMAIL_SERVER_PORT') ? '✅' : '❌');
console.log('- EMAIL_SERVER_USER:', envContent.includes('EMAIL_SERVER_USER') ? '✅' : '❌');
console.log('- EMAIL_SERVER_PASSWORD:', envContent.includes('EMAIL_SERVER_PASSWORD') ? '✅' : '❌');
console.log('- EMAIL_FROM:', envContent.includes('EMAIL_FROM') ? '✅' : '❌');
console.log('');

// Check if EMAIL_SERVER_PORT is missing
if (!envContent.includes('EMAIL_SERVER_PORT')) {
  console.log('Adding missing EMAIL_SERVER_PORT...');
  
  // Add it after EMAIL_SERVER_HOST or at the end of email section
  if (envContent.includes('EMAIL_SERVER_HOST')) {
    envContent = envContent.replace(
      /EMAIL_SERVER_HOST=([^\n]+)/,
      'EMAIL_SERVER_HOST=$1\nEMAIL_SERVER_PORT=587'
    );
  } else {
    // Add all email settings if missing
    envContent += '\n\n# Email Configuration\nEMAIL_SERVER_HOST=smtp.hostinger.com\nEMAIL_SERVER_PORT=587\nEMAIL_SERVER_USER=noreply@rapidtechpro.com\nEMAIL_SERVER_PASSWORD=DildilPakistan786@786@waqas\nEMAIL_FROM=noreply@rapidtechpro.com\n';
  }
  
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ .env file updated!\n');
} else {
  console.log('✅ All email settings are present\n');
}

console.log('Final check:');
const finalContent = fs.readFileSync(envPath, 'utf8');
const emailLines = finalContent.split('\n').filter(line => line.includes('EMAIL'));
emailLines.forEach(line => console.log('  ', line));
console.log('');

