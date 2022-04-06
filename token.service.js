const jwt = require('jsonwebtoken');
const { ssoPublicKey } = require('./server/config/config').keys;

const ISSUER = 'bhere-sso';

function verifyToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, ssoPublicKey, { issuer: ISSUER, algorithms: ['RS256'] }, (err, decoded) => {
			if (err) {
				return reject(err);
			}
			return resolve(decoded);
		});
	});
}

module.exports = {
	verifyToken,
};
