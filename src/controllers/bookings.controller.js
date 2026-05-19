const pool = require('../db');
const { sendBookingConfirmation } = require('../services/email.service');

const createBooking = async (req, res) => {
  const { space_id, booking_date, time_slot, seat, total_price, send_notification, notify_email } = req.body;

  if (!space_id || !booking_date || !time_slot) {
    return res.status(400).json({ error: 'space_id, booking_date and time_slot required.' });
  }

  try {
    // Seat-aware conflict detection: if a seat is specified, only conflict on same seat
    let conflict;
    if (seat) {
      conflict = await pool.query(
        `SELECT id FROM bookings
         WHERE space_id=$1 AND booking_date=$2
           AND time_slot=$3 AND seat=$4 AND status != 'CANCELLED'`,
        [space_id, booking_date, time_slot, seat]
      );
    } else {
      conflict = await pool.query(
        `SELECT id FROM bookings
         WHERE space_id=$1 AND booking_date=$2
           AND time_slot=$3 AND seat IS NULL AND status != 'CANCELLED'`,
        [space_id, booking_date, time_slot]
      );
    }

    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: 'Slot already booked.' });
    }

    const result = await pool.query(
      `INSERT INTO bookings (user_id, space_id, booking_date, time_slot, seat, total_price)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.id, space_id, booking_date, time_slot, seat || null, total_price]
    );

    const booking = result.rows[0];
    res.status(201).json(booking);
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
    console.error('getUserBooking error:', err.message);
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

const getOtherUsersBookings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, s.title, s.area, s.image_url, u.name AS booker_name, u.email AS booker_email
       FROM bookings b
       JOIN spaces s ON b.space_id = s.id
       JOIN users  u ON b.user_id  = u.id
       WHERE s.owner_id = $1 and b.status != 'CANCELLED'
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const toggleConfirmBooking = async (req, res) => {
  try {
    const check = await pool.query(
      `SELECT b.id, b.status, b.is_confirmed, b.booking_date, b.time_slot, b.total_price, 
              s.owner_id, s.title AS space_name, u.email AS booker_email
       FROM bookings b
       JOIN spaces s ON b.space_id = s.id
       JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [req.params.id]
    );

    if (check.rows.length === 0)
      return res.status(404).json({ error: 'Booking not found.' });

    const bookingDetails = check.rows[0];

    if (bookingDetails.owner_id !== req.user.id)
      return res.status(403).json({ error: 'Not your space.' });

    if (bookingDetails.status === 'CANCELLED')
      return res.status(400).json({ error: 'Cannot confirm a cancelled booking.' });

    const result = await pool.query(
      `UPDATE bookings
       SET is_confirmed = NOT is_confirmed
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );
    
    const updated = result.rows[0];

    // If the booking just became confirmed, send an email to the booker
    if (updated.is_confirmed && bookingDetails.booker_email) {
      // Format the Postgres Date object to a clean string (YYYY-MM-DD)
      const formattedDate = new Date(updated.booking_date).toISOString().split('T')[0];
      
      sendBookingConfirmation(bookingDetails.booker_email, {
        spaceName: bookingDetails.space_name,
        bookingDate: formattedDate,
        timeSlot: updated.time_slot,
        totalPrice: updated.total_price || 0,
      }).catch(err => console.error('Email notification error:', err));
    }

    res.json({
      ...updated,
      message: updated.is_confirmed ? 'Booking confirmed.' : 'Booking unconfirmed.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { createBooking, getUserBookings, cancelBooking, getOtherUsersBookings, toggleConfirmBooking };