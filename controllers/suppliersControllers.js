const pool = require('../config/db');

// GET all suppliers
const getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY id');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Supplier Tidak ditemukan.' });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data supplier.', error: error.message });
  }
};

// GET supplier by ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID supplier wajib disertakan.' });
    }
    const result = await pool.query('SELECT * FROM suppliers WHERE id=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Supplier tidak ditemukan.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data supplier.', error: error.message });
  }
};

// POST create supplier
const create = async (req, res) => {
  try {
    const { name, contact_info } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Field "name" wajib diisi.' });
    }
    if (!contact_info) {
      return res.status(400).json({ message: 'Field "contact_info" wajib diisi.' });
    }

    const result = await pool.query(
      `INSERT INTO suppliers (name, contact_info, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
      [name, contact_info]
    );
    res.status(201).json({ message: 'Supplier berhasil dibuat.', supplier: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat supplier.', error: error.message });
  }
};

// PUT update supplier
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_info } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Field "name" wajib diisi.' });
    }
    if (!contact_info) {
      return res.status(400).json({ message: 'Field "contact_info" wajib diisi.' });
    }

    const result = await pool.query(
      `UPDATE suppliers SET name=$1, contact_info=$2, updated_at=NOW() WHERE id=$3 RETURNING *`,
      [name, contact_info, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Supplier tidak ditemukan.' });
    }

    res.json({ message: 'Supplier berhasil diperbarui.', supplier: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui supplier.', error: error.message });
  }
};

// DELETE supplier
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID supplier wajib disertakan.' });
    }
    const result = await pool.query('DELETE FROM suppliers WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Supplier tidak ditemukan.' });
    }
    res.json({ message: 'Supplier berhasil dihapus.', supplier: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus supplier.', error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
