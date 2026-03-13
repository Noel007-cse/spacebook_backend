const pool = require('../db');

const createBooking = async (req, res) => {
  const { space_id, booking_date, time_slot, total_price } = req.body;

  if (!space_id || !booking_date || !time_slot) {
    return res.status(400).json({ error: 'space_id, booking_date and time_slot required.' });
  }

  try {
    const conflict = await pool.query(
      `SELECT id FROM bookings
       WHERE space_id=$1 AND booking_date=$2
         AND time_slot=$3 AND status != 'CANCELLED'`,
      [space_id, booking_date, time_slot]
    );

    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: 'Slot already booked.' });
    }

    const result = await pool.query(
      `INSERT INTO bookings (user_id, space_id, booking_date, time_slot, total_price)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.id, space_id, booking_date, time_slot, total_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, s.title, s.image_url, s.area
       FROM bookings b
       JOIN spaces s ON b.space_id = s.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const check = await pool.query(
      'SELECT user_id FROM bookings WHERE id = $1', [req.params.id]
    );
    if (check.rows.length === 0) return res.status(404).json({ error: 'Not found.' });
    if (check.rows[0].user_id !== req.user.id)
      return res.status(403).json({ error: 'Not your booking.' });

    await pool.query(
      "UPDATE bookings SET status='CANCELLED' WHERE id=$1", [req.params.id]
    );
    res.json({ message: 'Booking cancelled.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { createBooking, getUserBookings, cancelBooking };