const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 resolution to prevent ENETUNREACH errors on Render with IPv6
dns.setDefaultResultOrder('ipv4first');
let transporter = null;
let senderEmail = null;

/**
 * Initialize the email transporter.
 * 
 * If EMAIL_USER and EMAIL_PASS are set in .env → uses Gmail (real emails).
 * Otherwise → falls back to Ethereal (fake test emails).
 */
async function initTransporter() {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // ── Production Mode: Gmail SMTP ──
  if (emailUser && emailPass) {
    console.log(`📧 Using Gmail SMTP with: ${emailUser}`);

    // Resolve IPv4 manually because Render's IPv6 networking breaks SMTP
    const ipv4 = await new Promise((resolve, reject) => {
      dns.lookup('smtp.gmail.com', { family: 4 }, (err, address) => {
        if (err) resolve('smtp.gmail.com'); // fallback
        else resolve(address);
      });
    });

    console.log(`📧 Resolved smtp.gmail.com to IPv4: ${ipv4}`);

    transporter = nodemailer.createTransport({
      host: ipv4,
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        servername: 'smtp.gmail.com', // required when using IP for host
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    senderEmail = emailUser;

    // Verify connection works on startup
    try {
      await transporter.verify();
      console.log('📧 Gmail SMTP connection verified successfully!');
    } catch (verifyErr) {
      console.error('📧 Gmail SMTP verification FAILED:', verifyErr.message);
      console.error('   Check that EMAIL_USER and EMAIL_PASS (App Password) are correct.');
      // Don't null out transporter — let it retry on actual send
    }

    return transporter;
  }

  // ── Dev Mode: Ethereal (fake SMTP) ──
  try {
    const testAccount = await nodemailer.createTestAccount();

    console.log('📧 No EMAIL_USER/EMAIL_PASS found → using Ethereal (test mode)');
    console.log(`   User: ${testAccount.user}`);
    console.log(`   Pass: ${testAccount.pass}`);
    console.log(`   Web:  https://ethereal.email/login`);
    console.log('   (Use the above credentials to view sent emails)\n');

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    senderEmail = testAccount.user;
    return transporter;
  } catch (err) {
    console.error('Failed to create email transporter:', err);
    return null;
  }
}

/**
 * Send a booking confirmation email.
 * @param {string} toEmail - Recipient email address
 * @param {object} details - Booking details
 * @param {string} details.spaceName - Name of the booked space
 * @param {string} details.bookingDate - Date of booking (YYYY-MM-DD)
 * @param {string} details.timeSlot - Time slot (e.g. "09:00 AM")
 * @param {number} details.totalPrice - Total price for the booking
 */
async function sendBookingConfirmation(toEmail, details) {
  const transport = await initTransporter();
  if (!transport) {
    console.error('Email transporter not available. Skipping email.');
    return null;
  }

  const { spaceName, bookingDate, timeSlot, totalPrice } = details;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8faf5; border-radius: 16px; overflow: hidden; border: 1px solid #e0e8d0;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #3F6B00 0%, #5a9a00 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 0.5px;">
          ✅ Booking Confirmed!
        </h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">
          Your space has been successfully reserved
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 32px 24px;">
        <h2 style="color: #2d2d2d; margin: 0 0 20px; font-size: 18px;">
          Booking Details
        </h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8edd8; color: #888; font-size: 14px;">Space</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8edd8; color: #2d2d2d; font-weight: 600; text-align: right; font-size: 14px;">
              ${spaceName}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8edd8; color: #888; font-size: 14px;">📅 Date</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8edd8; color: #2d2d2d; font-weight: 600; text-align: right; font-size: 14px;">
              ${bookingDate}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8edd8; color: #888; font-size: 14px;">⏰ Time Slot</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8edd8; color: #2d2d2d; font-weight: 600; text-align: right; font-size: 14px;">
              ${timeSlot}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888; font-size: 14px;">💰 Total Price</td>
            <td style="padding: 12px 0; color: #3F6B00; font-weight: 700; text-align: right; font-size: 16px;">
              ₹${totalPrice}
            </td>
          </tr>
        </table>

        <!-- Reminder Box -->
        <div style="background: #eef5e0; border-left: 4px solid #3F6B00; border-radius: 0 8px 8px 0; padding: 16px; margin-top: 24px;">
          <p style="margin: 0; color: #3F6B00; font-weight: 600; font-size: 14px;">
            ⏰ Reminder
          </p>
          <p style="margin: 6px 0 0; color: #555; font-size: 13px; line-height: 1.5;">
            You have booked <strong>${spaceName}</strong> on <strong>${bookingDate}</strong> at <strong>${timeSlot}</strong>.
            Please arrive on time. Don't forget to carry any required ID or access pass.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #f0f4e6; padding: 20px 24px; text-align: center; border-top: 1px solid #e0e8d0;">
        <p style="margin: 0; color: #888; font-size: 12px;">
          This is an automated email from SpaceBook. Do not reply to this email.
        </p>
        <p style="margin: 8px 0 0; color: #aaa; font-size: 11px;">
          © ${new Date().getFullYear()} SpaceBook — Book spaces, effortlessly.
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transport.sendMail({
      from: `"SpaceBook" <${senderEmail}>`,
      to: toEmail,
      subject: `Booking Confirmed — ${spaceName} on ${bookingDate}`,
      html: htmlBody,
    });

    // If using Ethereal, show preview URL; if Gmail, show messageId
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📧 [Ethereal] Email preview: ${previewUrl}`);
      return previewUrl;
    } else {
      console.log(`📧 [Gmail] Real email sent to ${toEmail} (ID: ${info.messageId})`);
      return info.messageId;
    }
  } catch (err) {
    console.error('Failed to send booking email:', err);
    return null;
  }
}

async function testEmailEndpoint(req, res) {
  try {
    const transport = await initTransporter();
    if (!transport) {
      return res.status(500).json({ error: 'Transporter not initialized' });
    }

    const info = await transport.sendMail({
      from: `"SpaceBook" <${senderEmail}>`,
      to: process.env.EMAIL_USER || 'noeljcherian07@gmail.com',
      subject: "Render Deployment Email Test",
      text: "Testing email directly from Render API endpoint."
    });

    res.json({ success: true, messageId: info.messageId, mode: process.env.EMAIL_USER ? 'Gmail' : 'Ethereal' });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}

module.exports = { sendBookingConfirmation, initTransporter, testEmailEndpoint };
