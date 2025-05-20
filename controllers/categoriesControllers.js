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
  const { id,nama } = req.body;

  if (!nama || nama.trim() === '') {
    return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
  }

  try {
    // Cek apakah nama kategori sudah ada (opsional)
    const check = await pool.query('SELECT * FROM categories WHERE nama = $1', [nama]);
    if (check.rows.length > 0) {
      return res.status(409).json({ message: 'Nama kategori sudah ada.' });
    }

    const result = await pool.query(
      `INSERT INTO categories (id,nama)
       VALUES ($1, $2) RETURNING *`,
      [id,nama]
    );
    res.status(201).json({ message: 'Kategori berhasil dibuat.', category: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat kategori.', error: error.message });
  }
};

const update = async (req, res) => {
  const { nama } = req.body;
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return res.status(400).json({ message: 'ID kategori wajib disertakan di URL.' });
  }

  if (!nama || nama.trim() === '') {
    return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
  }

  try {
    const check = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    const checkNama = await pool.query(
      'SELECT * FROM categories WHERE nama = $1 AND id <> $2',
      [nama, id]
    );
    if (checkNama.rows.length > 0) {
      return res.status(409).json({ message: 'Nama kategori sudah digunakan oleh kategori lain.' });
    }

    const result = await pool.query(
      'UPDATE categories SET nama = $1 WHERE id = $2 RETURNING *',
      [nama, id]
    );

    res.json({ message: 'Kategori berhasil diupdate.', category: result.rows[0] });
  } catch (error) {
    console.error('Update error:', error); // Tambahan debug
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
