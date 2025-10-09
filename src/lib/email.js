// Email utility using nodemailer with inline transporter creation
// This approach avoids Next.js build minification issues

// Send email verification
async function sendVerificationEmail(to, name, verificationToken) {
  try {
    console.log('📤 Sending verification email to:', to);
    console.log('   Verification token:', verificationToken);
    
    // Import nodemailer dynamically
    const nodemailer = require('nodemailer');
    
    // Create transporter inline
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
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/academy/verify-email?token=${verificationToken}`;
    
    console.log('   Verification URL:', verificationUrl);
    
    const mailOptions = {
      from: `"QuickTouch Academy" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Verify Your Email - QuickTouch Academy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #facc15 0%, #eab308 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #1f2937; font-size: 32px; font-weight: bold;">
                Welcome to QuickTouch! 🎉
              </h1>
              <p style="margin: 10px 0 0 0; color: #374151; font-size: 16px;">
                Let's verify your email address
              </p>
            </div>

            <!-- Body -->
            <div style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for registering with QuickTouch Academy! We're excited to have you on board. 
                To complete your registration and access all features, please verify your email address.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationUrl}" 
                   style="display: inline-block; padding: 16px 40px; background-color: #eab308; color: #1f2937; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(234, 179, 8, 0.3);">
                  ✅ Verify Email Address
                </a>
              </div>

              <p style="margin: 30px 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link in your browser:
              </p>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #eab308; word-break: break-all;">
                <a href="${verificationUrl}" style="color: #2563eb; text-decoration: none; font-size: 13px;">
                  ${verificationUrl}
                </a>
              </div>

              <div style="margin: 30px 0 0 0; padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Security Notice:</strong> This verification link will expire in 24 hours. 
                  If you didn't create an account with QuickTouch Academy, please ignore this email.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Need help? Contact our support team
              </p>
              <p style="margin: 0 0 15px 0; color: #2563eb; font-size: 14px;">
                <a href="mailto:support@rapidtechpro.com" style="color: #2563eb; text-decoration: none;">
                  support@rapidtechpro.com
                </a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2025 QuickTouch Academy. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to QuickTouch Academy!
        
        Hi ${name},
        
        Thank you for registering! Please verify your email address by clicking the link below:
        
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create this account, please ignore this email.
        
        Best regards,
        QuickTouch Academy Team
      `
    };

    console.log('   Sending email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Verification email sent successfully!');
    console.log('   Message ID:', info.messageId);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.response) console.error('   SMTP Response:', error.response);
    throw error;
  }
}

// Send password reset email
async function sendPasswordResetEmail(to, name, resetToken) {
  try {
    // Import nodemailer dynamically
    const nodemailer = require('nodemailer');
    
    // Create transporter inline
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
    
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/academy/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"QuickTouch Academy" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Reset Your Password - QuickTouch Academy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #facc15 0%, #eab308 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #1f2937; font-size: 32px; font-weight: bold;">
                Reset Your Password 🔐
              </h1>
              <p style="margin: 10px 0 0 0; color: #374151; font-size: 16px;">
                QuickTouch Academy
              </p>
            </div>

            <!-- Body -->
            <div style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; padding: 16px 40px; background-color: #eab308; color: #1f2937; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(234, 179, 8, 0.3);">
                  🔑 Reset Password
                </a>
              </div>

              <p style="margin: 30px 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link in your browser:
              </p>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #eab308; word-break: break-all;">
                <a href="${resetUrl}" style="color: #2563eb; text-decoration: none; font-size: 13px;">
                  ${resetUrl}
                </a>
              </div>

              <div style="margin: 30px 0 0 0; padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Security Notice:</strong> This reset link will expire in 1 hour. 
                  If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Need help? Contact our support team
              </p>
              <p style="margin: 0 0 15px 0; color: #2563eb; font-size: 14px;">
                <a href="mailto:support@rapidtechpro.com" style="color: #2563eb; text-decoration: none;">
                  support@rapidtechpro.com
                </a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2025 QuickTouch Academy. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Reset Your Password
        
        Hi ${name},
        
        We received a request to reset your password. Click the link below to create a new password:
        
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, please ignore this email.
        
        Best regards,
        QuickTouch Academy Team
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
async function testEmailConfiguration() {
  try {
    // Import nodemailer dynamically
    const nodemailer = require('nodemailer');
    
    // Create transporter inline
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
    
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('Email configuration error:', error);
    return { success: false, error: error.message };
  }
}

// Export functions
module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  testEmailConfiguration
};
