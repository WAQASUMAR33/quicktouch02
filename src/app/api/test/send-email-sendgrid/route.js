import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// POST /api/test/send-email-sendgrid - Send test email via SendGrid
export async function POST(req) {
  try {
    const { email } = await req.json();
    const recipientEmail = email || 'theitxprts786@gmail.com';

    console.log('\n📧 Testing SendGrid Email...\n');
    
    // Check API key
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'SENDGRID_API_KEY is not set',
        message: 'Please add SENDGRID_API_KEY to your environment variables'
      }, { status: 500 });
    }

    console.log('✅ SendGrid API Key:', process.env.SENDGRID_API_KEY.substring(0, 10) + '...');
    console.log('📧 From Email:', process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM);
    console.log('📨 To Email:', recipientEmail);
    console.log('');

    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Send email
    console.log('🔄 Sending email via SendGrid...');
    const msg = {
      to: recipientEmail,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@rapidtechpro.com',
        name: 'QuickTouch Academy'
      },
      subject: '✅ SendGrid Test Email - QuickTouch Academy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #FCD34D, #F59E0B); padding: 40px; border-radius: 10px; text-align: center;">
            <h1 style="color: #1f2937; margin: 0; font-size: 36px;">⚽ QuickTouch Academy</h1>
            <p style="color: #1f2937; margin: 10px 0 0 0; font-size: 20px;">SendGrid Email Test</p>
          </div>
          
          <div style="background: white; padding: 40px; margin-top: 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <div style="text-align: center; background: #d4edda; padding: 40px; border-radius: 10px; margin-bottom: 30px;">
              <div style="font-size: 80px; margin-bottom: 15px;">✅</div>
              <h2 style="color: #28a745; margin: 0; font-size: 28px;">SendGrid Working!</h2>
              <p style="color: #155724; margin: 10px 0 0 0; font-size: 16px;">Emails are being sent successfully via SendGrid API.</p>
            </div>

            <h3 style="color: #333;">Test Details:</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 12px; font-weight: bold; color: #F59E0B;">Recipient:</td>
                <td style="padding: 12px;">${recipientEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 12px; font-weight: bold; color: #F59E0B;">Sent Via:</td>
                <td style="padding: 12px;">SendGrid API</td>
              </tr>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 12px; font-weight: bold; color: #F59E0B;">From:</td>
                <td style="padding: 12px;">${process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; color: #F59E0B;">Timestamp:</td>
                <td style="padding: 12px;">${new Date().toLocaleString()}</td>
              </tr>
            </table>

            <div style="background: #e7f3ff; border-left: 4px solid #2196F3; padding: 20px; margin-top: 20px; border-radius: 5px;">
              <h4 style="margin-top: 0; color: #0c5da5;">✅ What This Means:</h4>
              <ul style="color: #0c5da5; margin: 0; padding-left: 20px;">
                <li><strong>SendGrid is configured correctly</strong></li>
                <li><strong>Email sending is working</strong></li>
                <li><strong>Verification emails will work</strong></li>
                <li><strong>Password reset emails will work</strong></li>
                <li><strong>No SMTP port issues</strong></li>
                <li><strong>Works perfectly with Vercel</strong></li>
              </ul>
            </div>

            <div style="margin-top: 30px; text-align: center;">
              <p style="font-size: 18px; color: #28a745; font-weight: bold;">🎉 Email System Ready!</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} QuickTouch Academy</p>
            <p>Powered by SendGrid</p>
          </div>
        </div>
      `,
      text: `
QuickTouch Academy - SendGrid Test Email

✅ SENDGRID WORKING!

Emails are being sent successfully via SendGrid API.

Test Details:
- Recipient: ${recipientEmail}
- Via: SendGrid API
- From: ${process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM}
- Time: ${new Date().toLocaleString()}

This means:
✅ SendGrid is configured correctly
✅ Email sending is working
✅ Verification emails will work
✅ Password reset emails will work

Your email system is ready!

---
QuickTouch Academy
Powered by SendGrid
      `
    };

    const result = await sgMail.send(msg);
    
    console.log('✅ Email sent successfully via SendGrid!');
    console.log('   Status Code:', result[0].statusCode);
    console.log('   Message ID:', result[0].headers['x-message-id']);
    console.log('');

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${recipientEmail} via SendGrid`,
      details: {
        statusCode: result[0].statusCode,
        messageId: result[0].headers['x-message-id'],
        recipient: recipientEmail
      }
    });

  } catch (error) {
    console.error('❌ SendGrid error:', error);
    
    if (error.response) {
      console.error('   Response:', error.response.body);
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to send email via SendGrid',
      details: {
        message: error.message,
        code: error.code,
        response: error.response?.body
      },
      help: {
        apiKey: 'Make sure SENDGRID_API_KEY is set correctly',
        fromEmail: 'Make sure sender email is verified in SendGrid',
        signup: 'Sign up at https://sendgrid.com if you haven\'t',
        verify: 'Verify your sender email in SendGrid dashboard'
      }
    }, { status: 500 });
  }
}

// GET version
export async function GET(req) {
  return POST(req);
}

