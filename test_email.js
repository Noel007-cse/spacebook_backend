require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP Connection successful!');
    
    // Try sending a test email to the same address
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email from SpaceBook Backend",
      text: "If you see this, email sending is working!"
    });
    console.log('✅ Test email sent! Message ID:', info.messageId);
    
  } catch (err) {
    console.error('❌ SMTP Connection failed:', err.message);
  }
}

testEmail();
