require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendTestEmail() {
  console.log('\n📧 Sending Test Email to theitxprts786@gmail.com...\n');

  try {
    // Email configuration
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
    console.log('  Password:', config.password ? 'SET (length: ' + config.password.length + ')' : 'NOT SET');
    console.log('');

    // Create transporter
    console.log('🔄 Creating SMTP transporter...');
    const transporter = nodemailer.createTransporter({
      host: config.host,
      port: config.port,
      secure: false, // Use STARTTLS
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true, // Show SMTP traffic
      logger: true // Log to console
    });

    // Verify connection
    console.log('🔄 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    // Send email
    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: `"QuickTouch Academy Test" <${config.from}>`,
      to: 'theitxprts786@gmail.com',
      subject: '✅ Test Email from QuickTouch - ' + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 30px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 32px;">⚽ QuickTouch Academy</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Email Test Successful!</p>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 30px; margin-top: 20px; border: 2px solid #28a745;">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="font-size: 64px;">✅</div>
              <h2 style="color: #28a745; margin: 10px 0;">EMAIL SYSTEM WORKING!</h2>
              <p style="color: #666;">Your SMTP configuration is correct and emails are being sent successfully.</p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Configuration Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #dee2e6;">
                  <td style="padding: 10px; font-weight: bold; color: #667eea;">SMTP Host:</td>
                  <td style="padding: 10px;">${config.host}</td>
                </tr>
                <tr style="border-bottom: 1px solid #dee2e6;">
                  <td style="padding: 10px; font-weight: bold; color: #667eea;">SMTP Port:</td>
                  <td style="padding: 10px;">${config.port}</td>
                </tr>
                <tr style="border-bottom: 1px solid #dee2e6;">
                  <td style="padding: 10px; font-weight: bold; color: #667eea;">From Email:</td>
                  <td style="padding: 10px;">${config.from}</td>
                </tr>
                <tr style="border-bottom: 1px solid #dee2e6;">
                  <td style="padding: 10px; font-weight: bold; color: #667eea;">Sent At:</td>
                  <td style="padding: 10px;">${new Date().toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #155724;">✅ What This Means:</h4>
              <ul style="margin: 0; padding-left: 20px; color: #155724;">
                <li>Email configuration is correct</li>
                <li>SMTP connection successful</li>
                <li>Verification emails will work</li>
                <li>Password reset emails will work</li>
                <li>All email features are functional</li>
              </ul>
            </div>

            <h3>Test Results:</h3>
            <p>🎯 <strong>Recipient:</strong> theitxprts786@gmail.com</p>
            <p>📬 <strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">DELIVERED</span></p>
            <p>🕐 <strong>Timestamp:</strong> ${new Date().toISOString()}</p>

            <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h4 style="margin-top: 0; color: #856404;">📝 Next Steps:</h4>
              <ol style="margin: 0; padding-left: 20px; color: #856404;">
                <li>Test academy registration</li>
                <li>Check for verification email</li>
                <li>Test password reset flow</li>
                <li>Monitor production logs</li>
              </ol>
            </div>
          </div>

          <div style="margin-top: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} QuickTouch Academy. All rights reserved.</p>
            <p>This is a test email. You can safely ignore or delete it.</p>
          </div>
        </div>
      `,
      text: `
QuickTouch Academy - Email Test

✅ EMAIL SYSTEM WORKING!

If you received this email, your SMTP configuration is correct.

Configuration:
- SMTP Host: ${config.host}
- SMTP Port: ${config.port}  
- From: ${config.from}
- Sent: ${new Date().toLocaleString()}

This means:
✅ Email configuration is correct
✅ SMTP connection successful  
✅ Verification emails will work
✅ Password reset emails will work

Test successful!

---
QuickTouch Academy
      `
    });

    console.log('\n✅ SUCCESS! Test email sent!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('To:', 'theitxprts786@gmail.com');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('Accepted:', info.accepted);
    console.log('Rejected:', info.rejected);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📬 Check your inbox at theitxprts786@gmail.com\n');
    console.log('🎉 Email system is working!\n');

  } catch (error) {
    console.error('\n❌ ERROR sending test email:\n');
    console.error('Error:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.command) console.error('Command:', error.command);
    if (error.response) console.error('Response:', error.response);
    console.error('\nFull error:', error);
    console.log('\n📝 Troubleshooting:');
    console.log('1. Check SMTP credentials');
    console.log('2. Verify host and port');
    console.log('3. Check firewall settings');
    console.log('4. Try different SMTP port (465, 2525)');
    console.log('');
  }
}

sendTestEmail();

