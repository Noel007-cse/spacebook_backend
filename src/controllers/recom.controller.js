const pool = require('../db');

const getRecom = async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT DISTINCT s.*
        FROM recommendations r
        JOIN spaces s ON r.space_id = s.id
        WHERE r.user_id = $1
            OR r.user_id = 1
      `,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getRecom };