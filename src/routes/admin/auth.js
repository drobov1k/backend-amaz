const express = require('express');
const { requireSignin } = require('../../common-middleware');
const { signup, signin, signout } = require('../../controller/admin/auth');
const { isRequestValidated, validateSignupRequest, validateSigninRequest } = require('../../validators/auth');

const router = express.Router();

router.post('/admin/signup', isRequestValidated, validateSignupRequest, signup);
router.post('/admin/signin', isRequestValidated, validateSigninRequest, signin);
router.post('/admin/signout', requireSignin, signout);

module.exports = router;
