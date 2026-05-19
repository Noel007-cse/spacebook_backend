const jwt = require('jsonwebtoken');

// Generate a valid token using the local secret
const token = jwt.sign(
  { id: 1, email: 'user@spacebook.com', account_type: 'buyer' },
  'spacebook_super_secret_2024',
  { expiresIn: '1h' }
);

console.log('Generated Token:', token);

// Make a request to the deployed backend
async function testBooking() {
  try {
    const response = await fetch('https://spacebook-backend-qzvl.onrender.com/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        space_id: 1,
        booking_date: '2026-05-20',
        time_slot: '10:00 AM',
        total_price: 1200,
        send_notification: true,
        notify_email: 'noeljcherian07@gmail.com'
      })
    });

    const data = await response.json();
    console.log('Status Code:', response.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testBooking();
