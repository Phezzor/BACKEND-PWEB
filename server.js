const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const supplierRoutes = require('./routes/supplier');
const transaksiRoutes = require('./routes/transaksi');
const detailTransaksiRoutes = require('./routes/detail_transaksi');
const authRouthes = require('./routes/auth');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouthes);
app.use('/api/product', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/detail_transaksi', detailTransaksiRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Faktur API 🚀');
  });

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});