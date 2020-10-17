const express = require('express');
const { addItemToCart } = require('../controller/cart');
const { userMiddleware, requireSignin } = require('../common-middleware');

const router = express.Router();

router.post('/user/cart/add', requireSignin, userMiddleware, addItemToCart);

module.exports = router;
