const pool = require('../db');

const getRecom = async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT DISTINCT s.*,
        EXISTS (
          SELECT 1 FROM favorites f
          WHERE f.user_id = $1 AND f.space_id = s.id
        ) AS is_favorite
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

const addRecom = async (req, res) => {
  try {
    const { space_id } = req.body;

    const result = await pool.query(
      `
      INSERT INTO recommendations (user_id, space_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [req.user.id, space_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    // Handle duplicate (already favorited)
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Already in recommendations' });
    }

    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getRecom, addRecom };