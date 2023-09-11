import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { randomBytes } from 'crypto'

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
    console.log("NATS Info: ", process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
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

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(9002, () => {
    console.log('Catalog Listening on port 9002!!!!!!!!');
  });
};

start();
