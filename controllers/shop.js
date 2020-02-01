const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.find() // fetch all products
    .then(products => {
      console.log(products);
      
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
        // hasProducts: products.length > 0,
        // activeShop: true,
        // productCSS: true
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  console.log(req.user.cart);
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'My Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.addOrder().then(result => {
    res.redirect('/orders').catch(err => console.log(err));
  });
};

exports.getOrder = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/order', {
        pageTitle: 'My Order(s)',
        path: '/order',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(product => {
      res.render('shop/index', {
        prods: product,
        pageTitle: 'Home Page',
        path: '/'
        // hasProducts: products.length > 0,
        // activeShop: true,
        // productCSS: true
      });
    })
    .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     pageTitle: 'Checkout',
//     path: '/checkout'
//   });
// };