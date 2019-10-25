'use strict';

const env = require('./env');
const { envVariables } = require('./env');
const winston = require('winston');

module.exports = winston.createLogger({
  level: env.get(envVariables.logLevel),
  transports: [new winston.transports.Console()]
});
