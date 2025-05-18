const pool = require('../config/db');

// GET all transaction items
const getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transaction_items ORDER BY id');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tidak ada item transaksi ditemukan.' });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data item transaksi.', error: error.message });
  }
};

// GET transaction item by ID
const getById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transaction_items WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item transaksi tidak ditemukan.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil item transaksi.', error: error.message });
  }
};

// CREATE new transaction item
const create = async (req, res) => {
  const { transaction_id, product_id, quantity, price } = req.body;

  // Validasi input sederhana
  if (!transaction_id) return res.status(400).json({ message: 'transaction_id wajib diisi.' });
  if (!product_id) return res.status(400).json({ message: 'product_id wajib diisi.' });
  if (quantity == null || isNaN(quantity) || quantity <= 0)
    return res.status(400).json({ message: 'quantity harus berupa angka lebih besar dari 0.' });
  if (price == null || isNaN(price) || price < 0)
    return res.status(400).json({ message: 'price harus berupa angka dan minimal 0.' });

  try {
    const result = await pool.query(
      `INSERT INTO transaction_items (transaction_id, product_id, quantity, price, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [transaction_id, product_id, quantity, price]
    );
    res.status(201).json({ message: 'Item transaksi berhasil dibuat.', transactionItem: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat item transaksi.', error: error.message });
  }
};

// UPDATE transaction item
const update = async (req, res) => {
  const { transaction_id, product_id, quantity, price } = req.body;

  // Validasi input sederhana
  if (!transaction_id) return res.status(400).json({ message: 'transaction_id wajib diisi.' });
  if (!product_id) return res.status(400).json({ message: 'product_id wajib diisi.' });
  if (quantity == null || isNaN(quantity) || quantity <= 0)
    return res.status(400).json({ message: 'quantity harus berupa angka lebih besar dari 0.' });
  if (price == null || isNaN(price) || price < 0)
    return res.status(400).json({ message: 'price harus berupa angka dan minimal 0.' });

  try {
    const result = await pool.query(
      `UPDATE transaction_items
       SET transaction_id = $1, product_id = $2, quantity = $3, price = $4, updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [transaction_id, product_id, quantity, price, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item transaksi tidak ditemukan.' });
    }
    res.json({ message: 'Item transaksi berhasil diupdate.', transactionItem: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate item transaksi.', error: error.message });
  }
};

// DELETE transaction item
const remove = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM transaction_items WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item transaksi tidak ditemukan.' });
    }
    res.json({ message: 'Item transaksi berhasil dihapus.', transactionItem: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus item transaksi.', error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
