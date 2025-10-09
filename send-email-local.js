require('dotenv').config();
const SMTPClient = require('smtp-client').default;

async function sendEmail() {
  console.log('\n📧 Sending Email from Local Environment...\n');

  const config = {
    host: process.env.EMAIL_SERVER_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    user: process.env.EMAIL_SERVER_USER || 'noreply@rapidtechpro.com',
    password: process.env.EMAIL_SERVER_PASSWORD || 'DildilPakistan786@786@waqas',
    from: process.env.EMAIL_FROM || 'noreply@rapidtechpro.com'
  };

  console.log('Configuration:');
  console.log('  Host:', config.host);
  console.log('  Port:', config.port);
  console.log('  User:', config.user);
  console.log('  From:', config.from);
  console.log('');

  const client = new SMTPClient({
    host: config.host,
    port: config.port,
    secure: false // STARTTLS
  });

  try {
    console.log('🔄 Connecting to SMTP server...');
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('🔄 Authenticating...');
    await client.greet({ hostname: 'quicktouch.local' });
    await client.authPlain(config.user, config.password);
    console.log('✅ Authenticated!\n');

    console.log('📨 Sending email to theitxprts786@gmail.com...');
    
    const emailContent = `From: QuickTouch Academy <${config.from}>
To: theitxprts786@gmail.com
Subject: =?UTF-8?B?4pyFIFF1aWNrVG91Y2ggQWNhZGVteSAtIFRlc3QgRW1haWw=?=
Content-Type: text/html; charset=UTF-8
MIME-Version: 1.0

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #FCD34D, #F59E0B); padding: 40px; border-radius: 10px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 36px;">⚽ QuickTouch Academy</h1>
      <p style="color: white; margin: 10px 0 0 0; font-size: 20px;">Email Test from Local Environment</p>
    </div>
    
    <div style="background: white; padding: 40px; margin-top: 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <div style="text-align: center; background: #d4edda; padding: 40px; border-radius: 10px; margin-bottom: 30px;">
        <div style="font-size: 80px; margin-bottom: 15px;">✅</div>
        <h2 style="color: #28a745; margin: 0; font-size: 28px;">EMAIL SYSTEM WORKING!</h2>
        <p style="color: #155724; margin: 10px 0 0 0; font-size: 16px;">Your local SMTP configuration is correct and emails are being sent.</p>
      </div>

      <h3 style="color: #333;">Test Results:</h3>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 12px; font-weight: bold; color: #F59E0B; width: 40%;">Recipient:</td>
            <td style="padding: 12px;">theitxprts786@gmail.com</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 12px; font-weight: bold; color: #F59E0B;">From:</td>
            <td style="padding: 12px;">${config.from}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 12px; font-weight: bold; color: #F59E0B;">SMTP Server:</td>
            <td style="padding: 12px;">${config.host}:${config.port}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 12px; font-weight: bold; color: #F59E0B;">Sent At:</td>
            <td style="padding: 12px;">${new Date().toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; color: #F59E0B;">Environment:</td>
            <td style="padding: 12px;">Local Development</td>
          </tr>
        </table>
      </div>

      <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin-top: 20px; border-radius: 5px;">
        <h4 style="margin-top: 0; color: #856404;">✅ What This Means:</h4>
        <ul style="color: #856404; margin: 0; padding-left: 20px;">
          <li><strong>SMTP configuration is correct</strong></li>
          <li><strong>Email sending is working locally</strong></li>
          <li><strong>Verification emails will work</strong></li>
          <li><strong>Password reset emails will work</strong></li>
          <li><strong>All email features are functional</strong></li>
        </ul>
      </div>

      <div style="background: #e7f3ff; border-left: 4px solid #2196F3; padding: 20px; margin-top: 20px; border-radius: 5px;">
        <h4 style="margin-top: 0; color: #0c5da5;">📝 Next Steps:</h4>
        <ol style="color: #0c5da5; margin: 0; padding-left: 20px;">
          <li>Test academy registration with your email</li>
          <li>Check inbox for verification email</li>
          <li>Click verification link to verify account</li>
          <li>Test password reset flow</li>
          <li>Deploy to production with same configuration</li>
        </ol>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <p style="font-size: 18px; color: #28a745; font-weight: bold;">🎉 Email System Ready!</p>
        <p style="color: #666;">You can now use all email features in QuickTouch Academy.</p>
      </div>
    </div>

    <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
      <p>© ${new Date().getFullYear()} QuickTouch Academy. All rights reserved.</p>
      <p>This is a test email sent from your local development environment.</p>
    </div>
  </div>
</body>
</html>`;

    await client.mail({ from: config.from });
    await client.rcpt({ to: 'theitxprts786@gmail.com' });
    await client.data(emailContent);
    
    console.log('✅ Email sent successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('To: theitxprts786@gmail.com');
    console.log('From:', config.from);
    console.log('Server:', config.host + ':' + config.port);
    console.log('Time:', new Date().toLocaleString());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📬 Check your inbox at theitxprts786@gmail.com!');
    console.log('   (Also check Spam and Promotions folders)\n');
    console.log('🎉 Email sent successfully from local environment!\n');

    await client.quit();

  } catch (error) {
    console.error('\n❌ Error sending email:', error.message);
    if (error.code) console.error('   Code:', error.code);
    if (error.response) console.error('   Response:', error.response);
    console.error('\nFull error:', error);
    
    try {
      await client.quit();
    } catch (quitError) {
      // Ignore quit errors
    }
  }
}

sendEmail();

