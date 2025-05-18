const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tidak ada produk ditemukan.' });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data produk.', error: error.message });
  }
};

// GET PRODUCT BY ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk.', error: error.message });
  }
};

// GET PRODUCT BY PRODUCT CODE
exports.getByProductCode = async (req, res) => {
  try {
    const { product_code } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE product_code = $1', [product_code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk.', error: error.message });
  }
};

// GET PRODUCT BY CATEGORY
exports.getByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE category_id = $1', [category_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan dalam kategori tersebut.' });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk berdasarkan kategori.', error: error.message });
  }
};

// CREATE PRODUCT
exports.create = async (req, res) => {
  try {
    const { id, product_code, name, category_id, stock_quantity, price } = req.body;

    // Validasi input minimal
    if (!id) return res.status(400).json({ message: 'Field id wajib diisi.' });
    if (!product_code) return res.status(400).json({ message: 'Field product_code wajib diisi.' });
    if (!name) return res.status(400).json({ message: 'Field name wajib diisi.' });
    if (!category_id) return res.status(400).json({ message: 'Field category_id wajib diisi.' });
    if (stock_quantity == null || isNaN(stock_quantity) || stock_quantity < 0) {
      return res.status(400).json({ message: 'Field stock_quantity harus berupa angka >= 0.' });
    }
    if (price == null || isNaN(price) || price < 0) {
      return res.status(400).json({ message: 'Field price harus berupa angka >= 0.' });
    }

    const result = await pool.query(
      'INSERT INTO products (id, product_code, name, category_id, stock_quantity, price, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
      [id, product_code, name, category_id, stock_quantity, price]
    );
    res.status(201).json({ message: 'Produk berhasil dibuat.', product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat produk.', error: error.message });
  }
};

// UPDATE PRODUCT
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_code, name, category_id, stock_quantity, price } = req.body;

    // Validasi input minimal
    if (!product_code) return res.status(400).json({ message: 'Field product_code wajib diisi.' });
    if (!name) return res.status(400).json({ message: 'Field name wajib diisi.' });
    if (!category_id) return res.status(400).json({ message: 'Field category_id wajib diisi.' });
    if (stock_quantity == null || isNaN(stock_quantity) || stock_quantity < 0) {
      return res.status(400).json({ message: 'Field stock_quantity harus berupa angka >= 0.' });
    }
    if (price == null || isNaN(price) || price < 0) {
      return res.status(400).json({ message: 'Field price harus berupa angka >= 0.' });
    }

    const result = await pool.query(
      'UPDATE products SET product_code = $1, name = $2, category_id = $3, stock_quantity = $4, price = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [product_code, name, category_id, stock_quantity, price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }
    res.json({ message: 'Produk berhasil diupdate.', product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate produk.', error: error.message });
  }
};

// DELETE PRODUCT
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }
    res.json({ message: 'Produk berhasil dihapus.', deletedProduct: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus produk.', error: error.message });
  }
};
