const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data user.', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID user wajib disertakan.' });
    }
    const result = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data user.', error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
};
