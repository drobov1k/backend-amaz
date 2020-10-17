const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const { adminMiddleware, requireSignin } = require('../common-middleware');
const { createProduct } = require('../controller/product');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${shortid.generate()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/product/create',
  requireSignin,
  adminMiddleware,
  upload.array('productPicture'),
  createProduct);

module.exports = router;
