const config = require("../sso.config");

function loginGet(req, res, next) {
	const { redirectUrl } = req.query;
	const login = config.sso.loginUrl.replace('{redirectUrl}', redirectUrl);
	console.log('loginGet', login, redirectUrl);
	return res.redirect(login);
};

module.exports = loginGet;
