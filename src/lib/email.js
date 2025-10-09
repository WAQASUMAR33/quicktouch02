import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  
  // Validate required environment variables
  const requiredVars = {
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM
  };

  const missing = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('❌ Missing email configuration:', missing.join(', '));
    throw new Error(`Missing email configuration: ${missing.join(', ')}`);
  }

  console.log('📧 Email Configuration:');
  console.log('  Host:', process.env.EMAIL_SERVER_HOST);
  console.log('  Port:', process.env.EMAIL_SERVER_PORT);
  console.log('  User:', process.env.EMAIL_SERVER_USER);
  console.log('  From:', process.env.EMAIL_FROM);

  return nodemailer.createTransporter({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false // Accept self-signed certificates
    }
  });
};

// Send email verification
export async function sendVerificationEmail(to, name, verificationToken) {
  try {
    console.log('📤 Sending verification email to:', to);
    console.log('   Verification token:', verificationToken);
    
    const transporter = createTransporter();
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/academy/verify-email?token=${verificationToken}`;
    
    console.log('   Verification URL:', verificationUrl);
    
    const mailOptions = {
      from: `"QuickTouch Academy" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Verify Your Academy Email Address',
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
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: white;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">⚽ QuickTouch Academy</div>
            <h1 style="color: white; margin: 0;">Email Verification</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for registering your academy with QuickTouch. We're excited to have you on board!</p>
            <p>To complete your registration and access all features, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${verificationUrl}
            </p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with QuickTouch, please ignore this email.</p>
            <p>Best regards,<br>The QuickTouch Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} QuickTouch Academy. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${name}!

Thank you for registering your academy with QuickTouch.

To complete your registration, please verify your email address by visiting this link:
${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account with QuickTouch, please ignore this email.

Best regards,
The QuickTouch Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    if (error.response) console.error('   SMTP Response:', error.response);
    throw error;
  }
}

// Send password reset email
export async function sendPasswordResetEmail(to, name, resetToken) {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/academy/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"QuickTouch Academy" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Reset Your Password - QuickTouch Academy',
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
            }
            .container {
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: white;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">⚽ QuickTouch Academy</div>
            <h1 style="color: white; margin: 0;">Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>We received a request to reset the password for your QuickTouch Academy account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${resetUrl}
            </p>
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul style="margin: 10px 0;">
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request a password reset, please ignore this email</li>
                <li>Your password will not change until you access the link and create a new one</li>
              </ul>
            </div>
            <p>For security reasons, we recommend choosing a strong password that you haven't used before.</p>
            <p>Best regards,<br>The QuickTouch Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} QuickTouch Academy. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${name}!

We received a request to reset the password for your QuickTouch Academy account.

To reset your password, visit this link:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

Best regards,
The QuickTouch Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('Email configuration error:', error);
    return { success: false, error: error.message };
  }
}

