const Product = require('../models/product');
const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getAddProduct = (req, res, next) => {
  res.render('pages/store/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/store/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/store/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('pages/store/admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/store/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/store/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      res.render('pages/store/admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/store/admin/products',
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/store/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getAddUser = (req, res, next) => {
  res.render('pages/store/admin/add-user', {
    pageTitle: 'Add User',
    path: '/store/admin/add-user',
    editing: false,
  });
};

exports.postAddUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    console.log(hash);
    const user = new User({ ...req.body, password: hash });
    await user.save();
    console.log('User created');
    res.redirect('/store/shop');
  } catch (error) {
    console.log(error);
  }
};
