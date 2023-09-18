import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { randomBytes } from 'crypto'
import { BuyerPaymentMethodVerifiedDomainEventListener } from './domain-events/listeneres/buyer-payment-method-verified-domain-event.listener';
import { OrderCancelledDomainEventListener } from './domain-events/listeneres/order-cancelled-domain-event.listener';
import { OrderShippedDomainEventListener } from './domain-events/listeneres/order-shipped-domain-event.listener';
import { OrderStartedDomainEventListener } from './domain-events/listeneres/order-started-domain-event.listener';
import { OrderStatusChangedToAwaitingValidationDomainEventListener } from './domain-events/listeneres/order-status-changedToAwaitingValidation-domain-event.listener';
import { OrderStatusChangedToAwaitingValidationDomainEventPublisher } from './domain-events/publishers/order-status-changedToAwaitingValidation-domain-event.publisher';
import { OrderStatusChangedToPaidDomainEventListener } from './domain-events/listeneres/order-status-changed-to-paid-domain-event.listener';
import { OrderStatusChangedToStockConfirmedDomainEventListener } from './domain-events/listeneres/order-status-changed-to-stock-confirmed-domain-event.listener';
import { OrderPaymentFailedEventListener } from './events/Listeners/order-payment-failed.listener';
import { OrderPaymentSucceededListener } from './events/Listeners/order-payment-succeeded.listener';
import { OrderStockConfirmedListener } from './events/Listeners/order-stock-confirmed.listener';
import { OrderStockRejectedListener } from './events/Listeners/order-stock-rejected.listener';
import { UserCheckoutAcceptedListener } from './events/Listeners/user-checkout-accepted.listener';


const start = async () => {
  console.log('Starting up........');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS URL must be defined")
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS CLIENT ID must be defined")
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS CLUSTER ID  must be defined")
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      randomBytes(4).toString('hex'),
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new BuyerPaymentMethodVerifiedDomainEventListener(natsWrapper.client).listen();
    new OrderCancelledDomainEventListener(natsWrapper.client).listen();
    new OrderShippedDomainEventListener(natsWrapper.client).listen();
    new OrderStatusChangedToAwaitingValidationDomainEventListener(natsWrapper.client).listen();
    new OrderStatusChangedToPaidDomainEventListener(natsWrapper.client).listen();
    new OrderStatusChangedToStockConfirmedDomainEventListener(natsWrapper.client).listen();
    new OrderStartedDomainEventListener(natsWrapper.client).listen();

    new OrderPaymentFailedEventListener(natsWrapper.client).listen();
    new OrderPaymentSucceededListener(natsWrapper.client).listen();
    new OrderStockConfirmedListener(natsWrapper.client).listen();
    new OrderStockRejectedListener(natsWrapper.client).listen();
    new UserCheckoutAcceptedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(9004, () => {
    console.log('Order Listening on port 9003!!!!!!!!');
  });
};

start();
