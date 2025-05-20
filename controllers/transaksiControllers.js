const pool = require('../config/db');

const generateTransactionId = async () => {
  const result = await pool.query(`
    SELECT id FROM transactions 
    WHERE id LIKE 'TRX%' 
    ORDER BY id DESC 
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    return 'TRX00000001';
  }

  const lastId = result.rows[0].id; // e.g. 'TRX007'
  const numericPart = parseInt(lastId.replace('TRX', ''), 10); // 7
  const nextNumber = numericPart + 1;
  const padded = String(nextNumber).padStart(8, '0'); // '008'

  return `TRX${padded}`; // 'TRX008'
};


// GET all transactions
const getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY id');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tidak ada data transaksi ditemukan.' });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data transaksi.', error: error.message });
  }
};

// GET transaction by ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID transaksi wajib disertakan.' });
    }
    const result = await pool.query('SELECT * FROM transactions WHERE id=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data transaksi.', error: error.message });
  }
};

// CREATE new transaction
const create = async (req, res) => {
  try {
    const { user_id, type, description } = req.body;
    const id = await generateTransactionId()
    if (!id) 
      return res.status(400).json({ message: 'ID transaksi wajib disertakan.' });
    if (!user_id) 
      return res.status(400).json({ message: 'Field "user_id" wajib diisi.' });
    if (!type) 
      return res.status(400).json({ message: 'Field "type" wajib diisi.' });
    if (!description) 
      return res.status(400).json({ message: 'Field "deskripsi" wajib diisi.' });


    const result = await pool.query(
      `INSERT INTO transactions (id,user_id, type, description, created_at)
       VALUES ($1, $2, $3,$4, NOW()) RETURNING *`,
      [id, user_id, type, description]
    );
    res.status(201).json({ message: 'Transaksi berhasil dibuat.', transaction: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat transaksi.', error: error.message });
  }
};

// UPDATE transaction
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, type } = req.body;

    if (!id) 
      return res.status(400).json({ message: 'ID transaksi wajib disertakan.' });
    if (!user_id) 
      return res.status(400).json({ message: 'Field "user_id" wajib diisi.' });
    if (!type) 
      return res.status(400).json({ message: 'Field "type" wajib diisi.' });
    const result = await pool.query(
      `UPDATE transactions SET user_id=$1, type=$2 WHERE id=$3 RETURNING *`,
      [user_id, type, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }
    res.json({ message: 'Transaksi berhasil diperbarui.', transaction: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui transaksi.', error: error.message });
  }
};

// DELETE transaction
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'ID transaksi wajib disertakan.' });

    const result = await pool.query('DELETE FROM transactions WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }
    res.json({ message: 'Transaksi berhasil dihapus.', transaction: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus transaksi.', error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
