const keys = require('./keys/keys');

const TOKEN = 'l1Q7zkOL59cRqWBkQ12ZiGVW2DBL';

const ISSUER = 'bhere-sso';

const SSO_ORIGIN = 'http://localhost:3010';
const SSO_ORIGIN_LOGIN = `${SSO_ORIGIN}/sso/login?redirectUrl={redirectUrl}`;

module.exports = {
	keys,
	token: TOKEN,
	issuer: ISSUER,
	ssoOrigin: SSO_ORIGIN,
	ssoLogin: SSO_ORIGIN_LOGIN,
};
