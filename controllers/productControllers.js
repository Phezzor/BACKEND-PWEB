const pool = require('../config/db');

// GET ALL PRODUCTS (with category and supplier info)
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*, 
        c.nama AS category_nama, 
        s.nama AS supplier_nama
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
    `);

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
    const result = await pool.query(`
      SELECT 
        p.*, 
        c.nama AS category_nama, 
        s.nama AS supplier_nama
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk.', error: error.message });
  }
};

// GET PRODUCT BY PRODUK KODE
exports.getByProductCode = async (req, res) => {
  try {
    const { produk_kode } = req.params;
    const result = await pool.query(`
      SELECT * FROM products WHERE produk_kode = $1
    `, [produk_kode]);

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
    const result = await pool.query(`
      SELECT 
        p.*, 
        c.nama AS category_nama, 
        s.nama AS supplier_nama
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.category_id = $1`, [category_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan dalam kategori tersebut.' });
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk berdasarkan kategori.', error: error.message });
  }
};

// GET PRODUCT BY SUPPLIER
exports.getBySupplier = async (req, res) => {
  try {
    const { supplier_id } = req.params;
    const result = await pool.query(`
      SELECT 
        p.*, 
        c.nama AS category_nama, 
        s.nama AS supplier_nama
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.supplier_id = $1`, [supplier_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan oleh supplier tersebut.' });
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk berdasarkan supplier.', error: error.message });
  } 
};

// CREATE PRODUCT
exports.create = async (req, res) => {
  try {
    const { id, produk_kode, nama, deskripsi, harga, stock, category_id, supplier_id } = req.body;

    if (!id || !produk_kode || !nama || !category_id || !supplier_id) {
      return res.status(400).json({ message: 'Field wajib tidak lengkap.' });
    }
    if (stock == null || isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: 'Stock harus berupa angka >= 0.' });
    }
    if (harga == null || isNaN(harga) || harga < 0) {
      return res.status(400).json({ message: 'Harga harus berupa angka >= 0.' });
    }

    const result = await pool.query(`
      INSERT INTO products (id, produk_kode, nama, deskripsi, harga, stock, category_id, supplier_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `, [id, produk_kode, nama, deskripsi, harga, stock, category_id, supplier_id]);

    res.status(201).json({ message: 'Produk berhasil dibuat.', product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat produk.', error: error.message });
  }
};

// UPDATE PRODUCT
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { produk_kode, nama, deskripsi, harga, stock, category_id, supplier_id } = req.body;

    if (!produk_kode || !nama || !category_id || !supplier_id) {
      return res.status(400).json({ message: 'Field wajib tidak lengkap.' });
    }
    if (stock == null || isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: 'Stock harus berupa angka >= 0.' });
    }
    if (harga == null || isNaN(harga) || harga < 0) {
      return res.status(400).json({ message: 'Harga harus berupa angka >= 0.' });
    }

    const result = await pool.query(`
      UPDATE products 
      SET produk_kode = $1, nama = $2, deskripsi = $3, harga = $4, stock = $5, category_id = $6, supplier_id = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `, [produk_kode, nama, deskripsi, harga, stock, category_id, supplier_id, id]);

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




// const pool = require('../config/db');

// exports.getAll = async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM products');
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Tidak ada produk ditemukan.' });
//     }
//     res.json(result.rows);
//   } catch (error) {
//     res.status(500).json({ message: 'Gagal mengambil data produk.', error: error.message });
//   }
// };

// // GET PRODUCT BY ID
// exports.getById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Produk tidak ditemukan.' });
//     }
//     res.json(result.rows[0]);
//   } catch (error) {
//     res.status(500).json({ message: 'Gagal mengambil produk.', error: error.message });
//   }
// };

// // GET PRODUCT BY PRODUCT CODE
// exports.getByProductCode = async (req, res) => {
//   try {
//     const { produk_kode } = req.params;
//     const result = await pool.query('SELECT * FROM products WHERE produk_kode = $1', [produk_kode]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Produk tidak ditemukan.' });
//     }
//     res.json(result.rows[0]);
//   } catch (error) {
//     res.status(500).json({ message: 'Gagal mengambil produk.', error: error.message });
//   }
// };

// // GET PRODUCT BY CATEGORY
// exports.getByCategory = async (req, res) => {
//   try {
//     const { category_id } = req.params;
//     const result = await pool.query('SELECT * FROM products WHERE category_id = $1', [category_id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Produk tidak ditemukan dalam kategori tersebut.' });
//     }
//     res.json(result.rows);
//   } catch (error) {
//     res.status(500).json({ message: 'Gagal mengambil produk berdasarkan kategori.', error: error.message });
//   }
// };

// // CREATE PRODUCT
// exports.create = async (req, res) => {
//   try {
//     const { id, produk_kode, nama,deskripsi,category_id, stock_quantity, harga } = req.body;

//     // Validasi input minimal
//     if (!id) return res.status(400).json({ message: 'Field id wajib diisi.' });
//     if (!produk_kode) return res.status(400).json({ message: 'Field produk_kode wajib diisi.' });
//     if (!nama) return res.status(400).json({ message: 'Field nama wajib diisi.' });
//     if (!category_id) return res.status(400).json({ message: 'Field category_id wajib diisi.' });
//     if (stock_quantity == null || isNaN(stock_quantity) || stock_quantity < 0) {
//       return res.status(400).json({ message: 'Field stock_quantity harus berupa angka >= 0.' });
//     }
//     if (harga == null || isNaN(harga) || harga < 0) {
//       return res.status(400).json({ message: 'Field harga harus berupa angka >= 0.' });
//     }

//     const result = await pool.query(
//       'INSERT INTO products (id, produk_kode, nama,deskripsi,category_id, stock_quantity, harga, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
//       [id, produk_kode, nama,deskripsi,category_id, stock_quantity, harga]
//     );
//     res.status(201).json({ message: 'Produk berhasil dibuat.', product: result.rows[0] });
//   } catch (error) {
//     res.status(500).json({ message: 'Gagal membuat produk.', error: error.message });
//   }
// };

// // UPDATE PRODUCT
// exports.update = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { produk_kode, nama, category_id, stock_quantity, harga } = req.body;

//     // Validasi input minimal
//     if (!produk_kode) 
//       return res.status(400).json({ message: 'Field produk_kode wajib diisi.' });
//     if 
//     (!nama) return res.status(400).json({ message: 'Field nama wajib diisi.' });
//     if (!category_id) 
//       return res.status(400).json({ message: 'Field category_id wajib diisi.' });
//     if (stock_quantity == null || isNaN(stock_quantity) || stock_quantity < 0) {
//       return res.status(400).json({ message: 'Field stock_quantity harus berupa angka >= 0.' });
//     }
//     if (harga == null || isNaN(harga) || harga < 0) {
//       return res.status(400).json({ message: 'Field harga harus berupa angka >= 0.' });
//     }

//     const result = await pool.query(
//       'UPDATE products SET produk_kode = $1, nama = $2, category_id = $3, stock_quantity = $4, harga = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
//       [produk_kode, nama, category_id, stock_quantity, harga, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Produk tidak ditemukan.' });
//     }
//     res.json({ message: 'Produk berhasil diupdate.', product: result.rows[0] });
//   } catch (error) {
//     res.status(500).json({ message: 'Gagal mengupdate produk.', error: error.message });
//   }
// };

// // DELETE PRODUCT
// exports.delete = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: 'Produk tidak ditemukan.' });
//     }
//     res.json({ message: 'Produk berhasil dihapus.', deletedProduct: result.rows[0] });
//   } catch (error) {
//     res.status(500).json({ message: 'Gagal menghapus produk.', error: error.message });
//   }
// };
