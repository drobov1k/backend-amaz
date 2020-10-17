const slugify = require('slugify');
const Product = require('../models/product');

exports.createProduct = (req, resp) => {
  // resp.status(200).json({ file: req.files, body: req.body });
  const {
    name, price, description, category, quantity,
  } = req.body;

  let productPictures = [];

  if (req.files.length) {
    productPictures = req.files.map((file) => ({
      img: file.filename,
    }));
  }

  const product = new Product({
    name,
    price,
    description,
    productPictures,
    category,
    quantity,
    createdBy: req.user._id,
    slug: slugify(name),
  });

  product.save((err, prod) => {
    if (err) {
      return resp.status(400).json({ err });
    }
    if (product) {
      resp.status(201).json({ product: prod });
    }
  });
};
