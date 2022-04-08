require('dotenv').config();

const { serve } = require('./server/main');

const app = serve({ dirname: __dirname, name: 'bhere-sso-consumer', port: 3020 });
