const pool = require('../config/db');

const generateSupplierId = async () => {
  const result = await pool.query(`
    SELECT id FROM suppliers 
    WHERE id LIKE 'SUP%' 
    ORDER BY id DESC 
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    return 'SUP00000001';
  }

  const lastId = result.rows[0].id; // misalnya 'SUP00000123'
  const numericPart = parseInt(lastId.replace('SUP', ''), 10); // 123
  const nextNumber = numericPart + 1;
  const padded = String(nextNumber).padStart(8, '0'); // '00000124'

  return `SUP${padded}`; // hasil: 'SUP00000124'
};


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
    const {nama, contact_info,address} = req.body;
    const id = await generateSupplierId()
    if (!id) {
      return res.status(400).json({ message: 'Field "id" wajib diisi.' });
    }
    if (!nama) {
      return res.status(400).json({ message: 'Field "nama" wajib diisi.' });
    }
    if (!contact_info) {
      return res.status(400).json({ message: 'Field "contact_info" wajib diisi.' });
    }
    if (!address) {
      return res.status(400).json({ message: 'Field "address" wajib diisi.' });
    }

    const result = await pool.query(
      `INSERT INTO suppliers (id,nama, contact_info,address,created_at)
       VALUES ($1, $2,$3,$4, NOW()) RETURNING *`,
      [id,nama, contact_info,address]
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
    const { nama, contact_info } = req.body;

    if (!nama) {
      return res.status(400).json({ message: 'Field "nama" wajib diisi.' });
    }
    if (!contact_info) {
      return res.status(400).json({ message: 'Field "contact_info" wajib diisi.' });
    }

    const result = await pool.query(
      `UPDATE suppliers SET nama=$1, contact_info=$2 WHERE id=$3 RETURNING *`,
      [nama, contact_info, id]
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
