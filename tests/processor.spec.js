'use strict';

process.env['pubsub-topic'] = 'TESTTOPIC';

const { stub } = require('sinon');
const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const processor = require('../src/processor');

const data = {
  oldValue: {},
  updateMask: {},
  value: {
    createTime: '2019-10-25T14:48:48.021215Z',
    fields: {
      currency: { stringValue: 'USD' },
      description: {
        stringValue: 'We give the best fade with super highly trained staff.'
      },
      price: { integerValue: '20' },
      styleId: { stringValue: 'FADE' }
    },
    name:
      'projects/sweng-581-capstone/databases/(default)/documents/ServiceProvider/10001/services/GxdeN1pB7KwE9VqNFnGn',
    updateTime: '2019-10-25T14:48:48.021215Z'
  }
};

const context = {
  eventId: '5b83b6c4-0910-4a5e-9d73-1921123ac6ca-0',
  eventType: 'providers/cloud.firestore/eventTypes/document.write',
  notSupported: {},
  params: { providerId: '10001', serviceId: 'GxdeN1pB7KwE9VqNFnGn' },
  resource:
    'projects/sweng-581-capstone/databases/(default)/documents/ServiceProvider/10001/services/GxdeN1pB7KwE9VqNFnGn',
  timestamp: '2019-10-25T14:48:48.021215Z'
};

describe('service-offering-notification-publisher: unit tests', () => {
  let topic;

  before(() => {
    topic = {
      publish: stub().resolves()
    };
  });

  afterEach(() => {
    topic.publish.resetHistory();
  });

  it('should publish a message to pubsub', () => {
    const notification = {
      providerId: '10001',
      serviceId: 'GxdeN1pB7KwE9VqNFnGn',
      styleId: 'FADE',
      data: {
        description: 'We give the best fade with super highly trained staff.',
        price: 20,
        currency: 'USD'
      }
    };

    expect(processor(data, context, topic)).to.be.fulfilled.then(() => {
      expect(topic.publish.called).to.be.true;
      expect(
        topic.publish.calledWith(Buffer.from(JSON.stringify(notification)))
      ).to.be.true;
    });
  });

  it('should publish a message to pubsub based on oldValue fields if value is not populated DELETE scenario', () => {
    const data = {
      oldValue: {
        createTime: '2019-10-25T14:48:48.021215Z',
        fields: {
          currency: { stringValue: 'USD' },
          description: {
            stringValue:
              'We give the best fade with super highly trained staff.'
          },
          price: { integerValue: '20' },
          styleId: { stringValue: 'FADE' }
        },
        name:
          'projects/sweng-581-capstone/databases/(default)/documents/ServiceProvider/10001/services/GxdeN1pB7KwE9VqNFnGn',
        updateTime: '2019-10-25T14:48:48.021215Z'
      },
      updateMask: {},
      value: {}
    };

    const notification = {
      providerId: '10001',
      serviceId: 'GxdeN1pB7KwE9VqNFnGn',
      styleId: 'FADE',
      data: {}
    };

    expect(processor(data, context, topic)).to.be.fulfilled.then(() => {
      expect(topic.publish.called).to.be.true;
      expect(
        topic.publish.calledWith(Buffer.from(JSON.stringify(notification)))
      ).to.be.true;
    });
  });
});
