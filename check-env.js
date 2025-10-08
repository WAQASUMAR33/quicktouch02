require('dotenv').config();

console.log('📋 Checking .env file configuration...\n');

const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'EMAIL_SERVER_HOST',
  'EMAIL_SERVER_PORT',
  'EMAIL_SERVER_USER',
  'EMAIL_SERVER_PASSWORD',
  'EMAIL_FROM'
];

console.log('Environment Variables Status:\n');

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const display = value ? (varName.includes('PASSWORD') ? '***SET***' : value) : 'NOT SET';
  console.log(`${status} ${varName}: ${display}`);
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const missing = requiredVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.log('❌ Missing environment variables:');
  missing.forEach(v => console.log(`   - ${v}`));
  console.log('\n📝 Add these to your .env file:\n');
  
  if (missing.includes('EMAIL_SERVER_PORT')) {
    console.log('EMAIL_SERVER_PORT=587');
  }
  if (missing.includes('EMAIL_SERVER_PASSWORD')) {
    console.log('EMAIL_SERVER_PASSWORD=DildilPakistan786@786@waqas');
  }
  console.log('');
} else {
  console.log('✅ All required environment variables are set!\n');
}

