import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// POST /api/test/send-test-email - Send test email
export async function POST(req) {
  try {
    const { email } = await req.json();
    const recipientEmail = email || 'theitxprts786@gmail.com';

    console.log('\n📧 Testing Email Configuration...\n');
    
    // Check environment variables
    const config = {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      user: process.env.EMAIL_SERVER_USER,
      password: process.env.EMAIL_SERVER_PASSWORD,
      from: process.env.EMAIL_FROM
    };

    console.log('Environment Variables:');
    console.log('  EMAIL_SERVER_HOST:', config.host || '❌ NOT SET');
    console.log('  EMAIL_SERVER_PORT:', config.port || '❌ NOT SET');
    console.log('  EMAIL_SERVER_USER:', config.user || '❌ NOT SET');
    console.log('  EMAIL_SERVER_PASSWORD:', config.password ? '✅ SET' : '❌ NOT SET');
    console.log('  EMAIL_FROM:', config.from || '❌ NOT SET');
    console.log('');

    // Check for missing variables
    const missing = [];
    if (!config.host) missing.push('EMAIL_SERVER_HOST');
    if (!config.port) missing.push('EMAIL_SERVER_PORT');
    if (!config.user) missing.push('EMAIL_SERVER_USER');
    if (!config.password) missing.push('EMAIL_SERVER_PASSWORD');
    if (!config.from) missing.push('EMAIL_FROM');

    if (missing.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing email configuration',
        missing: missing,
        message: `Please add these environment variables: ${missing.join(', ')}`
      }, { status: 500 });
    }

    // Create transporter
    console.log('🔄 Creating SMTP transporter...');
    const transporter = nodemailer.createTransporter({
      host: config.host,
      port: parseInt(config.port),
      secure: false, // Use STARTTLS
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
    console.log('✅ SMTP connection verified!');

    // Send test email
    console.log('📨 Sending test email to:', recipientEmail);
    const info = await transporter.sendMail({
      from: `"QuickTouch Academy Test" <${config.from}>`,
      to: recipientEmail,
      subject: '✅ Test Email - QuickTouch Academy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px;
              padding: 30px;
              color: white;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 30px;
              margin-top: 20px;
              color: #333;
            }
            .success-box {
              background: #d4edda;
              border: 2px solid #28a745;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .info-table {
              width: 100%;
              margin: 20px 0;
              border-collapse: collapse;
            }
            .info-table td {
              padding: 10px;
              border-bottom: 1px solid #eee;
            }
            .info-table td:first-child {
              font-weight: bold;
              color: #667eea;
              width: 40%;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 style="margin: 0; font-size: 28px;">⚽ QuickTouch Academy</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Email System Test</p>
          </div>
          
          <div class="content">
            <div class="success-box">
              <div class="success-icon">✅</div>
              <h2 style="margin: 0; color: #28a745;">Email System Working!</h2>
              <p style="margin: 10px 0 0 0;">If you received this email, your SMTP configuration is correct.</p>
            </div>

            <h2>Test Email Details</h2>
            <table class="info-table">
              <tr>
                <td>Sent To:</td>
                <td>${recipientEmail}</td>
              </tr>
              <tr>
                <td>Sent From:</td>
                <td>${config.from}</td>
              </tr>
              <tr>
                <td>SMTP Host:</td>
                <td>${config.host}</td>
              </tr>
              <tr>
                <td>SMTP Port:</td>
                <td>${config.port}</td>
              </tr>
              <tr>
                <td>SMTP User:</td>
                <td>${config.user}</td>
              </tr>
              <tr>
                <td>Timestamp:</td>
                <td>${new Date().toISOString()}</td>
              </tr>
              <tr>
                <td>Environment:</td>
                <td>${process.env.NODE_ENV || 'development'}</td>
              </tr>
            </table>

            <h3>What This Means</h3>
            <ul>
              <li>✅ Email configuration is correct</li>
              <li>✅ SMTP connection successful</li>
              <li>✅ Emails can be sent</li>
              <li>✅ Verification emails will work</li>
              <li>✅ Password reset emails will work</li>
            </ul>

            <h3>Next Steps</h3>
            <ol>
              <li>Test academy registration</li>
              <li>Check for verification email</li>
              <li>Click verification link</li>
              <li>Test password reset flow</li>
            </ol>

            <p><strong>Your email system is ready to use!</strong></p>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} QuickTouch Academy. All rights reserved.</p>
            <p>This is a test email from the QuickTouch system.</p>
          </div>
        </body>
        </html>
      `,
      text: `
QuickTouch Academy - Email System Test

✅ EMAIL SYSTEM WORKING!

If you received this email, your SMTP configuration is correct.

Test Details:
- Sent To: ${recipientEmail}
- Sent From: ${config.from}
- SMTP Host: ${config.host}
- SMTP Port: ${config.port}
- Timestamp: ${new Date().toISOString()}

What this means:
✅ Email configuration is correct
✅ SMTP connection successful
✅ Emails can be sent
✅ Verification emails will work
✅ Password reset emails will work

Your email system is ready to use!

---
QuickTouch Academy
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('   Accepted:', info.accepted);
    console.log('   Rejected:', info.rejected);
    console.log('');

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${recipientEmail}`,
      details: {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected,
        recipient: recipientEmail,
        config: {
          host: config.host,
          port: config.port,
          user: config.user,
          from: config.from
        }
      }
    });

  } catch (error) {
    console.error('❌ Error sending test email:', error);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    if (error.response) console.error('   SMTP Response:', error.response);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email',
      details: {
        code: error.code,
        message: error.message,
        response: error.response
      }
    }, { status: 500 });
  }
}

// GET version for easy browser testing
export async function GET(req) {
  return POST(req);
}

