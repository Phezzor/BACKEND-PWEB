const pool = require('../config/db');

// GET all categories
const getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tidak ada kategori ditemukan.' });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data kategori.', error: error.message });
  }
};

// GET category by ID
const getById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Kategori tidak ditemukan dengan id tersebut.' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil kategori.', error: error.message });
  }
};

// POST create category
const create = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
  }

  try {
    // Cek apakah nama kategori sudah ada (opsional)
    const check = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
    if (check.rows.length > 0) {
      return res.status(409).json({ message: 'Nama kategori sudah ada.' });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, created_at, updated_at)
       VALUES ($1, NOW(), NOW()) RETURNING *`,
      [name]
    );
    res.status(201).json({ message: 'Kategori berhasil dibuat.', category: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat kategori.', error: error.message });
  }
};

// PUT update category
const update = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
  }

  try {
    // Cek apakah kategori ada
    const check = await pool.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    // Cek apakah nama kategori sudah dipakai oleh kategori lain (opsional)
    const checkName = await pool.query('SELECT * FROM categories WHERE name = $1 AND id <> $2', [
      name,
      req.params.id,
    ]);
    if (checkName.rows.length > 0) {
      return res.status(409).json({ message: 'Nama kategori sudah digunakan oleh kategori lain.' });
    }

    const result = await pool.query(
      `UPDATE categories SET name=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [name, req.params.id]
    );
    res.json({ message: 'Kategori berhasil diupdate.', category: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate kategori.', error: error.message });
  }
};

// DELETE category
const remove = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM categories WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    res.json({ message: 'Kategori berhasil dihapus.', category: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus kategori.', error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove, 
};
