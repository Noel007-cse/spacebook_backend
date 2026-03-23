const pool = require('../db');

const getFavorites = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT DISTINCT s.*
      FROM favorites f
      JOIN spaces s ON f.space_id = s.id
      WHERE f.user_id = $1
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { space_id } = req.body;

    const result = await pool.query(
      `
      INSERT INTO favorites (user_id, space_id)
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
      return res.status(400).json({ error: 'Already in favorites' });
    }

    res.status(500).json({ error: 'Server error.' });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const { space_id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM favorites
      WHERE user_id = $1 AND space_id = $2
      RETURNING *
      `,
      [req.user.id, space_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const isFavorite = async (req, res) => {
  try {
    const { space_id } = req.params;

    const result = await pool.query(
      `
      SELECT 1
      FROM favorites
      WHERE user_id = $1 AND space_id = $2
      `,
      [req.user.id, space_id]
    );

    res.json({
      isFavorite: result.rowCount > 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getFavorites, addFavorite, deleteFavorite, isFavorite };