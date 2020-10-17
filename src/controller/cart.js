const Cart = require('../models/cart');

exports.addItemToCart = (req, res) => {
  Cart.findOne({ user: req.user._id })
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error });
      if (cart) {
        const { product } = req.body.cartItems;
        const item = cart.cartItems.find((c) => {
          if (c) {
            // eslint-disable-next-line eqeqeq
            return c.product == product;
          } return false;
        });
        let condition;
        let update;
        if (item) {
          condition = { user: req.user._id, 'cartItems.product': product };
          update = {
            $set: {
              'cartItems.$': {
                ...req.body.cartItems,
                quantity: item.quantity + req.body.cartItems.quantity,
              },
            },
          };
        } else {
          condition = { user: req.user._id };
          update = {
            $push: {
              cartItems: req.body.cartItems,
            },
          };
        }
        Cart.findOneAndUpdate(condition, update)
          .exec((_error, _cart) => {
            if (_error) return res.status(400).json({ error: _error });
            if (_cart) {
              return res.status(201).json({ cart: _cart });
            }
          });
      } else {
        new Cart({
          user: req.user._id,
          cartItems: [req.body.cartItems],
        }).save((_error, _cart) => {
          if (_error) return res.status(400).json({ error: _error });
          if (cart) {
            return res.status(201).json({ cart: _cart });
          }
        });
      }
    });
};
