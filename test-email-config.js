require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('📧 Testing email configuration...\n');
  
  console.log('Email Settings:');
  console.log('- Host:', process.env.EMAIL_SERVER_HOST);
  console.log('- Port:', process.env.EMAIL_SERVER_PORT);
  console.log('- User:', process.env.EMAIL_SERVER_USER);
  console.log('- From:', process.env.EMAIL_FROM);
  console.log('- Password:', process.env.EMAIL_SERVER_PASSWORD ? '***set***' : '***NOT SET***');
  console.log('');

  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('🔄 Verifying connection...');
    await transporter.verify();
    console.log('✅ Email server connection successful!\n');

    // Send test email
    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: `"QuickTouch Academy" <${process.env.EMAIL_FROM}>`,
      to: 'dilwaq22@gmail.com',
      subject: 'Test Email - QuickTouch Academy',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from QuickTouch Academy.</p>
        <p>If you received this, your email configuration is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
      text: 'Test email from QuickTouch Academy. If you received this, your email configuration is working!'
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('\n🎉 Email configuration is working perfectly!\n');

  } catch (error) {
    console.error('❌ Email configuration error:');
    console.error('Error:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.command) console.error('Command:', error.command);
    console.error('\nFull error:', error);
  }
}

testEmail();

