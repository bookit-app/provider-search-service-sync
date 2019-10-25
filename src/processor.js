'use strict';

const { isEmpty } = require('lodash');
const logger = require('./logger');

/**
 * Generates a PubSub notification with details
 * of the service which was impacted. The following
 * information is placed into the notification
 *
 * {
 *  providerId: string,
 *  serviceId: string,
 *  styleId: string
 * }
 *
 * @param {*} data
 * @param {*} context
 * @returns {Promise<void>}
 */
module.exports.processor = async (data, context, topic) => {
  const { params } = context;

  const notification = {
    providerId: params.providerId,
    serviceId: params.serviceId,
    styleId: extractStyleId(data),
    data: isEmpty(data.value) ? {} : mapToService(data.value)
  };

  logger.info(
    `Generating service offering notification change event for ${JSON.stringify(
      notification
    )}`
  );

  // Generate pubsub notification
  return topic.publish(Buffer.from(JSON.stringify(notification)));
};

function mapToService(data) {
  return {
    description: data.fields.description.stringValue,
    price: parseInt(data.fields.price.integerValue),
    currency: data.fields.currency.stringValue
  };
}

/**
 * Extracts the styleId based on the data information
 * provided
 *
 * @param {*} data
 * @returns {String}
 */
function extractStyleId(data) {
  if (isEmpty(data.value)) {
    // This is a delete scenario take it from oldValue
    return data.oldValue.fields.styleId.stringValue;
  }

  return data.value.fields.styleId.stringValue;
}
