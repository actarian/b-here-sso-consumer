const fs = require('fs');
const path = require('path');

function readFileSync(keyPath) {
	const keyUrl = path.resolve(__dirname, keyPath);
	return fs.readFileSync(keyUrl);
}

// app secret to validate the request is coming from the authenticated server only.
const SSO_SECRED = process.env.SSO_SECRET || 'l1Q7zkOL59cRqWBkQ12ZiGVW2DBL';
const SSO_PUBLIC_KEY = process.env.SSO_PUBLIC_KEY || readFileSync('./sso.key');

const origin = 'http://localhost:3010';

const config = {
	sso: {
		secret: SSO_SECRED,
		issuer: 'bhere-sso',
		origin: `${origin}`,
		loginUrl: `${origin}/sso/login?redirectUrl={redirectUrl}`,
		registerUrl: `${origin}/sso/register?redirectUrl={redirectUrl}`,
		verifyTokenUrl: `${origin}/sso/verifytoken?verifyToken={verifytoken}`,
		publicKey: SSO_PUBLIC_KEY,
	}
};

module.exports = config;
