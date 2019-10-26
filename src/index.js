' use strict';

const env = require('./env');
const { envVariables } = require('./env');
const processor = require('./processor');
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const topic = pubsub.topic(env.get(envVariables.topic));

/**
 * Trigger the processor functionality for the event
 *
 * @param {*} data
 * @param {*} context
 * @returns {Promise<void>}
 */
module.exports.publishNotification = (data, context) => {
  return processor(data, context, topic);
};
