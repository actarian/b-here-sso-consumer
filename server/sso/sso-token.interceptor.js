const axios = require('axios');
const { decodeToken } = require('./sso-token.service');
const config = require('./sso.config');
const { URL } = require('url');

async function SingleSignOnTokenInterceptor(req, res, next) {
	// check if the req has the queryParameter as verifyToken
	// and who is the referer.
	const { verifyToken } = req.query;
	if (verifyToken != null) {
		// to remove the verifyToken in query parameter redirect.
		const requestUrl = new URL(req.url, `${req.protocol}://${req.headers.host}`);
		const redirectURL = requestUrl.pathname;
		console.log('redirectURL');
		try {
			const ssoVerifyUrl = config.sso.verifyTokenUrl.replace('{verifytoken}', verifyToken);
			const response = await axios.get(ssoVerifyUrl, {
				headers: {
					Authorization: `Bearer ${config.sso.secret}`
				}
			});
			const { token } = response.data;
			const decodedToken = await decodeToken(token);
			// now that we have the decoded jwt,
			// use the token sessionId as the global session id so that
			// the logout can be implemented with the global session.
			req.session.verifyToken = verifyToken;
			req.session.decodedToken = decodedToken;
		} catch (err) {
			return next(err);
		}
		return res.redirect(`${redirectURL}`);
	}
	return next();
}

module.exports = SingleSignOnTokenInterceptor;
