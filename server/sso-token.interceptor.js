const axios = require('axios');
const { verifyToken } = require('../token.service');
const config = require('./config/config');
const ssoOrigin = 'http://localhost:3010';
// const ssoOrigin = 'https://localhost:9443';
const { URL } = require('url');

async function SingleSignOnTokenInterceptor(req, res, next) {
	// check if the req has the queryParameter as ssoToken
	// and who is the referer.
	const { ssoToken } = req.query;
	if (ssoToken != null) {
		// to remove the ssoToken in query parameter redirect.
		const requestUrl = new URL(req.url, `${req.protocol}://${req.headers.host}`);
		const redirectURL = requestUrl.pathname;
		console.log('redirectURL');
		try {
			const ssoVerifyUrl = `${ssoOrigin}/sso/verifytoken?ssoToken=${ssoToken}`;
			const response = await axios.get(ssoVerifyUrl, {
				headers: {
					Authorization: `Bearer ${config.token}`
				}
			});
			const { token } = response.data;
			const decoded = await verifyToken(token);
			// now that we have the decoded jwt, use the,
			// global-session-id as the session id so that
			// the logout can be implemented with the global session.
			req.session.user = decoded;
		} catch (err) {
			return next(err);
		}
		return res.redirect(`${redirectURL}`);
	}
	return next();
}

module.exports = SingleSignOnTokenInterceptor;
