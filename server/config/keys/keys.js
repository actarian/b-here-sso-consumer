const fs = require('fs');
const path = require('path');

const SSO_PUBLIC_KEY = process.env.SSO_PUBLIC_KEY || path.resolve(__dirname, './sso.key');
const ssoPublicKey = fs.readFileSync(SSO_PUBLIC_KEY);
const ssoValidityKey = 'simple-sso-validatity-key';

module.exports = {
	ssoPublicKey,
	ssoValidityKey
};
