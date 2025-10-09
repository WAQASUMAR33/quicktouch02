import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid initialized');
} else {
  console.warn('⚠️  SENDGRID_API_KEY not set - emails will not be sent');
}

// Send email verification
export async function sendVerificationEmail(to, name, verificationToken) {
  try {
    console.log('📤 Sending verification email via SendGrid to:', to);
    console.log('   Verification token:', verificationToken);
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/academy/verify-email?token=${verificationToken}`;
    console.log('   Verification URL:', verificationUrl);
    
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@rapidtechpro.com',
        name: 'QuickTouch Academy'
      },
      subject: 'Verify Your Academy Email Address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%);
              border-radius: 10px;
              padding: 30px;
              color: #1f2937;
              text-align: center;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 30px;
              margin-top: 20px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%);
              color: #1f2937;
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">⚽ QuickTouch Academy</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Email Verification</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for registering your academy with QuickTouch. We're excited to have you on board!</p>
              <p>To complete your registration and access all features, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">
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

    const result = await sgMail.send(msg);
    console.log('✅ Verification email sent successfully via SendGrid!');
    console.log('   Status:', result[0].statusCode);
    console.log('   Message ID:', result[0].headers['x-message-id']);
    
    return { 
      success: true, 
      messageId: result[0].headers['x-message-id'],
      statusCode: result[0].statusCode 
    };
  } catch (error) {
    console.error('❌ Error sending verification email via SendGrid:', error);
    if (error.response) {
      console.error('   SendGrid Response:', error.response.body);
    }
    throw error;
  }
}

// Send password reset email
export async function sendPasswordResetEmail(to, name, resetToken) {
  try {
    console.log('📤 Sending password reset email via SendGrid to:', to);
    
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/academy/reset-password?token=${resetToken}`;
    console.log('   Reset URL:', resetUrl);
    
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@rapidtechpro.com',
        name: 'QuickTouch Academy'
      },
      subject: 'Reset Your Password - QuickTouch Academy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #FCA5A5 0%, #EF4444 100%);
              border-radius: 10px;
              padding: 30px;
              color: white;
              text-align: center;
            }
            .content {
              background: white;
              border-radius: 8px;
              padding: 30px;
              margin-top: 20px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #FCA5A5 0%, #EF4444 100%);
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">⚽ QuickTouch Academy</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Password Reset Request</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>We received a request to reset the password for your QuickTouch Academy account.</p>
              <p>Click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">
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

    const result = await sgMail.send(msg);
    console.log('✅ Password reset email sent successfully via SendGrid!');
    console.log('   Status:', result[0].statusCode);
    
    return { 
      success: true, 
      messageId: result[0].headers['x-message-id'],
      statusCode: result[0].statusCode 
    };
  } catch (error) {
    console.error('❌ Error sending password reset email via SendGrid:', error);
    if (error.response) {
      console.error('   SendGrid Response:', error.response.body);
    }
    throw error;
  }
}

// Test SendGrid configuration
export async function testSendGridConfiguration() {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not set');
    }
    
    console.log('✅ SendGrid API key is configured');
    return { success: true, message: 'SendGrid is ready to send emails' };
  } catch (error) {
    console.error('❌ SendGrid configuration error:', error);
    return { success: false, error: error.message };
  }
}

