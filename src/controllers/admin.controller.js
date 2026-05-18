const pool = require('../db');

// ── Dashboard Stats ─────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    // Split into separate queries to be robust against missing columns
    const bookingStats = await pool.query(`
      SELECT
        COUNT(*)::int AS total_bookings,
        COUNT(*) FILTER (WHERE is_confirmed = true)::int AS confirmed_bookings,
        COUNT(*) FILTER (WHERE is_confirmed = false AND status != 'CANCELLED')::int AS unconfirmed_bookings,
        COUNT(*) FILTER (WHERE status = 'CANCELLED')::int AS cancelled_bookings,
        COALESCE(SUM(total_price) FILTER (WHERE is_confirmed = true), 0)::int AS total_revenue
      FROM bookings
    `);

    const userStats = await pool.query(`SELECT COUNT(*)::int AS total_users FROM users`);

    // Space stats — handle case where approval_status column may not exist yet
    let spaceStats = { total_spaces: 0, pending_spaces: 0, approved_spaces: 0, rejected_spaces: 0 };
    try {
      const spaceResult = await pool.query(`
        SELECT
          COUNT(*)::int AS total_spaces,
          COUNT(*) FILTER (WHERE approval_status = 'PENDING')::int AS pending_spaces,
          COUNT(*) FILTER (WHERE approval_status = 'APPROVED')::int AS approved_spaces,
          COUNT(*) FILTER (WHERE approval_status = 'REJECTED')::int AS rejected_spaces
        FROM spaces WHERE is_active = true
      `);
      spaceStats = spaceResult.rows[0];
    } catch (e) {
      // approval_status column might not exist yet, fall back
      const fallback = await pool.query(`SELECT COUNT(*)::int AS total_spaces FROM spaces WHERE is_active = true`);
      spaceStats = { ...spaceStats, total_spaces: fallback.rows[0].total_spaces };
    }

    res.json({
      ...bookingStats.rows[0],
      ...userStats.rows[0],
      ...spaceStats,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ── All Bookings (read-only, filterable) ────────────────────────────────────
const getAllBookings = async (req, res) => {
  const { status } = req.query;
  try {
    let query = `
      SELECT b.*, s.title AS space_title, s.area, s.image_url,
             u.name AS booker_name, u.email AS booker_email,
             o.name AS owner_name
      FROM bookings b
      JOIN spaces s ON b.space_id = s.id
      JOIN users  u ON b.user_id  = u.id
      LEFT JOIN users o ON s.owner_id = o.id
    `;
    const params = [];

    if (status && status === 'confirmed') {
      query += ` WHERE b.is_confirmed = true`;
    } else if (status && status === 'unconfirmed') {
      query += ` WHERE b.is_confirmed = false AND b.status != 'CANCELLED'`;
    } else if (status && status === 'CANCELLED') {
      query += ` WHERE b.status = 'CANCELLED'`;
    }

    query += ` ORDER BY b.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get all bookings error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ── All Users ───────────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, account_type, created_at FROM users ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ── All Spaces (with approval status filter) ────────────────────────────────
const getAllSpaces = async (req, res) => {
  const { approval } = req.query;
  try {
    let query = `
      SELECT s.*, u.name AS owner_name, u.email AS owner_email
      FROM spaces s
      LEFT JOIN users u ON s.owner_id = u.id
    `;
    const params = [];

    if (approval) {
      query += ` WHERE s.approval_status = $1`;
      params.push(approval);
    }

    query += ` ORDER BY s.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Get all spaces error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ── Approve Space ───────────────────────────────────────────────────────────
const approveSpace = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE spaces
       SET approval_status = 'APPROVED', admin_rejection_reason = NULL
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Space not found.' });
    }

    res.json({ message: 'Space approved.', space: result.rows[0] });
  } catch (err) {
    console.error('Approve space error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

// ── Reject Space ────────────────────────────────────────────────────────────
const rejectSpace = async (req, res) => {
  const { reason } = req.body;
  try {
    const result = await pool.query(
      `UPDATE spaces
       SET approval_status = 'REJECTED', admin_rejection_reason = $1
       WHERE id = $2
       RETURNING *`,
      [reason || 'No reason provided', req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Space not found.' });
    }

    res.json({ message: 'Space rejected.', space: result.rows[0] });
  } catch (err) {
    console.error('Reject space error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = {
  getDashboardStats,
  getAllBookings,
  getAllUsers,
  getAllSpaces,
  approveSpace,
  rejectSpace,
};
