const express = require('express');
const router = express.Router();

const loginGet = require('./login/login.get');
const logoutGet = require('./logout/logout.get');
const tokenGet = require('./token/token.get');

router.route('/login')
	.get(loginGet);

router.route('/logout')
	.get(logoutGet);

router.route('/token')
	.get(tokenGet);

module.exports = router;
