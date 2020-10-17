/* eslint-disable no-console */
const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const userRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');

env.config();

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xqwd0.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
).then(() => {
  console.log('db connected');
});

const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '../uploads')));
app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server start ${process.env.PORT}`);
});
