const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('pages/store/shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/store/shop/products',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const product = await Product.findById(prodId);
    res.render('pages/store/shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/store/shop/products',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    console.log(products);
    res.render('pages/store/shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/store/shop',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = (req, res, next) => {
  try {
    req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        const products = user.cart.items;
        res.render('pages/store/shop/cart', {
          path: '/store/shop/cart',
          pageTitle: 'Your Cart',
          products: products,
        });
      })
      .catch(err => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const product = await Product.findById(prodId);
    req.user.addToCart(product);
    console.log(result);
    res.redirect('/store/shop/cart');
  } catch (error) {
    console.log(error);
  }
};

exports.postCartDeleteProduct = (req, res, next) => {
  try {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId).then(result => {
      res.redirect('/store/shop/cart');
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/store/shop/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });
    res.render('pages/store/shop/orders', {
      path: '/store/shop/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};
