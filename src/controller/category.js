/* eslint-disable no-restricted-syntax */
const slugify = require('slugify');
const Category = require('../models/category');

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;

  if (!parentId) {
    category = categories.filter((cat) => !cat.parentId);
  } else {
    // eslint-disable-next-line eqeqeq
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (const cat of category) {
    const currentCategory = {
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId,
      children: createCategories(categories, cat._id),
    };
    if (!currentCategory.children.length) {
      delete currentCategory.children;
    }
    categoryList.push(currentCategory);
  }

  return categoryList;
}

exports.addCategory = (req, resp) => {
  const categoryObj = {
    name: req.body.name,
    slug: slugify(req.body.name),
  };

  if (req.file) {
    categoryObj.categoryImage = `${process.env.API}public/${req.file.filename}`;
  }

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((err, category) => {
    if (err) {
      return resp.status(400).json({ err });
    }

    if (category) {
      return resp.status(201).json({ category });
    }
  });
};

exports.getCategories = (req, resp) => {
  Category.find({})
    .exec((err, categories) => {
      if (err) {
        return resp.status(400).json({ err });
      }

      if (categories) {
        const categoryList = createCategories(categories);

        return resp.status(200).json({ categories: categoryList });
      }
    });
};
