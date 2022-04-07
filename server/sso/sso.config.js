const fs = require('fs');
const path = require('path');
const SSO_PUBLIC_KEY = process.env.SSO_PUBLIC_KEY || path.resolve(__dirname, './sso.key');
const ssoPublicKey = fs.readFileSync(SSO_PUBLIC_KEY);

const origin = 'http://localhost:3010';

const config = {
	sso: {
		issuer: 'bhere-sso',
		bearer: 'l1Q7zkOL59cRqWBkQ12ZiGVW2DBL',
		origin: `${origin}`,
		loginUrl: `${origin}/sso/login?redirectUrl={redirectUrl}`,
		registerUrl: `${origin}/sso/register?redirectUrl={redirectUrl}`,
		verifyTokenUrl: `${origin}/sso/verifytoken?verifyToken={verifytoken}`,
		publicKey: ssoPublicKey,
	}
};

module.exports = config;
