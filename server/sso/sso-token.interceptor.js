const axios = require('axios');
const { decodeToken } = require('./sso-token.service');
const config = require('./sso.config');
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
			const ssoVerifyUrl = config.sso.verifyTokenUrl.replace('{verifytoken}', ssoToken);
			const response = await axios.get(ssoVerifyUrl, {
				headers: {
					Authorization: `Bearer ${config.sso.bearer}`
				}
			});
			const { token } = response.data;
			const ssoDecodedToken = await decodeToken(token);
			// now that we have the decoded jwt,
			// use the token sessionId as the global session id so that
			// the logout can be implemented with the global session.
			req.session.ssoToken = ssoToken;
			req.session.ssoDecodedToken = ssoDecodedToken;
		} catch (err) {
			return next(err);
		}
		return res.redirect(`${redirectURL}`);
	}
	return next();
}

module.exports = SingleSignOnTokenInterceptor;
