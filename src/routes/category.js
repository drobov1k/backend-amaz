const express = require('express');
const multer = require('multer');
const shortid = require('shortid');
const { addCategory } = require('../controller/category');
const { getCategories } = require('../controller/category');
const { adminMiddleware, requireSignin } = require('../common-middleware');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${shortid.generate()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post(
  '/category/create',
  requireSignin,
  adminMiddleware,
  upload.single('categoryImage'),
  addCategory,
);
router.get('/category/all', getCategories);

module.exports = router;
