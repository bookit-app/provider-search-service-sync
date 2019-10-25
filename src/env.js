'use strict';

const nconf = require('nconf');

const variables = {
  logLevel: 'app-log-level',
  topic: 'pubsub-topic'
};

nconf
  .env({
    lowerCase: true,
    parseValues: true,
    whitelist: Object.values(variables)
  })
  .defaults({
    app_log_level: 'info'
  });

nconf.required([variables.topic]);

module.exports = nconf;
module.exports.envVariables = variables;
