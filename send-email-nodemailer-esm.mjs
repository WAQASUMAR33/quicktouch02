import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function sendTestEmail() {
  console.log('\n📧 Sending Test Email...\n');

  const config = {
    host: process.env.EMAIL_SERVER_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    user: process.env.EMAIL_SERVER_USER || 'noreply@rapidtechpro.com',
    password: process.env.EMAIL_SERVER_PASSWORD || 'DildilPakistan786@786@waqas',
    from: process.env.EMAIL_FROM || 'noreply@rapidtechpro.com'
  };

  console.log('📋 Configuration:');
  console.log('   Host:', config.host);
  console.log('   Port:', config.port);
  console.log('   User:', config.user);
  console.log('   From:', config.from);
  console.log('   Password:', config.password ? `SET (${config.password.length} chars)` : 'NOT SET');
  console.log('');

  try {
    // Create transporter
    console.log('🔄 Creating transporter...');
    const transporter = nodemailer.createTransporter({
      host: config.host,
      port: config.port,
      secure: false,
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    console.log('🔄 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    // Send email
    console.log('📨 Sending email to theitxprts786@gmail.com...');
    const info = await transporter.sendMail({
      from: `"QuickTouch Test" <${config.from}>`,
      to: 'theitxprts786@gmail.com',
      subject: '✅ QuickTouch Academy - Test Email ' + new Date().toLocaleTimeString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #FCD34D, #F59E0B); padding: 40px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">⚽ QuickTouch Academy</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Email System Test</p>
          </div>
          
          <div style="background: white; padding: 30px; margin-top: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; background: #d4edda; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <div style="font-size: 64px; margin-bottom: 10px;">✅</div>
              <h2 style="color: #28a745; margin: 0;">Email Working!</h2>
              <p style="color: #155724; margin: 10px 0 0 0;">Your SMTP configuration is correct.</p>
            </div>

            <h3 style="color: #333;">Test Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Sent To:</td>
                <td style="padding: 10px;">theitxprts786@gmail.com</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">From:</td>
                <td style="padding: 10px;">${config.from}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">SMTP Host:</td>
                <td style="padding: 10px;">${config.host}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Port:</td>
                <td style="padding: 10px;">${config.port}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold;">Time:</td>
                <td style="padding: 10px;">${new Date().toLocaleString()}</td>
              </tr>
            </table>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 20px;">
              <h4 style="margin-top: 0; color: #856404;">What This Means:</h4>
              <ul style="color: #856404; margin: 0;">
                <li>✅ Email sending is working</li>
                <li>✅ Verification emails will work</li>
                <li>✅ Password reset will work</li>
                <li>✅ All email features are functional</li>
              </ul>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} QuickTouch Academy</p>
            <p>This is a test email - you can safely delete it</p>
          </div>
        </div>
      `,
      text: `
QuickTouch Academy - Test Email

✅ EMAIL WORKING!

If you received this, your SMTP is configured correctly.

Sent to: theitxprts786@gmail.com
From: ${config.from}
Host: ${config.host}
Port: ${config.port}
Time: ${new Date().toLocaleString()}

This means all email features will work!

---
QuickTouch Academy
      `
    });

    console.log('✅ Email sent successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('To:', 'theitxprts786@gmail.com');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('Accepted:', info.accepted);
    console.log('Rejected:', info.rejected);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ Check your inbox at theitxprts786@gmail.com!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Code:', error.code);
    if (error.response) console.error('SMTP Response:', error.response);
    console.error('\nFull error:', error);
  }
}

sendTestEmail();

