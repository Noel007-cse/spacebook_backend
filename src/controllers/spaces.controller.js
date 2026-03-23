const pool = require('../db');

const getAllSpaces = async (req, res) => {
  const { category } = req.query;
  try {
    let query = `SELECT s.*, EXISTS (
                SELECT 1 FROM favorites f
                WHERE f.user_id = $1 AND f.space_id = s.id
                ) AS is_favorite 
	              FROM spaces s WHERE is_active = true
                AND category = $2
                ORDER BY rating DESC`;
    const result = await pool.query(query, [req.user.id, category]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getMySpaces = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM spaces WHERE owner_id = $1 AND is_active = true ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getSpaceById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM spaces WHERE id = $1', [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Space not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const createSpace = async (req, res) => {
  const { title, category, area, description, price_per_hr, image_url, has_seats } = req.body;
  if (!title || !category || !price_per_hr) {
    return res.status(400).json({ error: 'Title, category and price are required.' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO spaces (owner_id, title, category, area, description, price_per_hr, image_url, has_seats)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.user.id, title, category, area, description, price_per_hr, image_url || '', has_seats || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const updateSpace = async (req, res) => {
  const { price_per_hr, description, is_active } = req.body;
  try {
    const check = await pool.query('SELECT owner_id FROM spaces WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Not found.' });
    if (check.rows[0].owner_id !== req.user.id)
      return res.status(403).json({ error: 'Not your space.' });
    const result = await pool.query(
      `UPDATE spaces SET price_per_hr = COALESCE($1, price_per_hr),
       description = COALESCE($2, description), is_active = COALESCE($3, is_active)
       WHERE id = $4 RETURNING *`,
      [price_per_hr, description, is_active, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const deleteSpace = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("Deleting space ID:", id);

    const result = await pool.query(
      "DELETE FROM spaces WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Space not found" });
    }

    res.json({ message: "Space deleted successfully" });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllSpaces, getMySpaces, getSpaceById, createSpace, updateSpace, deleteSpace };