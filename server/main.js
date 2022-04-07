const express = require('express');
const morgan = require('morgan');
const app = express();
const engine = require('ejs-mate');
const session = require('express-session');
const fs = require('fs');
const https = require('https');

const SingleSignOnGuard = require('./sso/sso.guard');
const SingleSignOnTokenInterceptor = require('./sso/sso-token.interceptor');

function serve(options) {

	const PORT = 5000;
	const PORT_HTTPS = 10443;

	options = options || {};
	options.dirname = options.dirname || path.join(__dirname, '../');
	options.name = options.name || 'bhere-sso';
	options.baseHref = options.baseHref || `/${options.name}/`;
	options.port = process.env.PORT || options.port || PORT;
	options.portHttps = options.portHttps || PORT_HTTPS;
	console.log('serve', options);

	options.host = `http://localhost:${options.port}`;
	options.hostHttps = `https://localhost:${options.portHttps}`;

	app.use(
		session({
			secret: 'bhere-sso-consumer',
			resave: false,
			saveUninitialized: true
		})
	);

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	app.use(morgan('dev'));
	app.engine('ejs', engine);
	app.set('views', options.dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(SingleSignOnTokenInterceptor);

	app.get('/', (req, res, next) => {
		res.render('index', {
			title: 'BHere SSO Consumer | Index',
		});
	});

	app.get('/reserved-area', SingleSignOnGuard, (req, res, next) => {
		res.render('reserved-area', {
			title: 'BHere SSO Consumer | Reserved Area',
			verifyToken: req.session.verifyToken,
			// decodedToken: req.session.decodedToken,
			decodedToken: JSON.stringify(req.session.decodedToken),
			user: req.session.decodedToken.user,
		});
	});

	app.use((req, res, next) => {
		// catch 404 and forward to error handler
		const err = new Error('Resource Not Found');
		err.status = 404;
		next(err);
	});

	app.use((err, req, res, next) => {
		console.error({
			message: err.message,
			error: err
		});
		const statusCode = err.status || 500;
		let message = err.message || 'Internal Server Error';
		if (statusCode === 500) {
			message = 'Internal Server Error';
		}
		res.status(statusCode).json({ message });
	});

	app.listen(options.port, () => {
		console.info(`${options.name} running server at ${options.host}`);
	});

	const heroku = (process.env._ && process.env._.indexOf('heroku'));
	if (!heroku) {
		const privateKey = fs.readFileSync('cert.key', 'utf8');
		const certificate = fs.readFileSync('cert.crt', 'utf8');
		const credentials = { key: privateKey, cert: certificate };
		const serverHttps = https.createServer(credentials, app);
		serverHttps.listen(options.portHttps, () => {
			console.log(`${options.name} running server at ${options.hostHttps}`);
		});
	}

	return app;
}

module.exports = {
	serve,
};
