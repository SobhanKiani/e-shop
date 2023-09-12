import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@sobhankiani/e-shop-common';
import promBundle from 'express-prom-bundle';
import winston from 'winston';
import { SeqTransport } from '@datalust/winston-seq';


import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { project_name: 'hello_world', project_type: 'test_metrics_labels' },
  promClient: {
    collectDefaultMetrics: {
    },
  },
  // transformLabels: (labels, req) => {
  //   // Add route-specific labels to distinguish different routes
  //   labels.route = req.path;
  //   return labels;
  // },
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: {
    /* application: 'your-app-name' */
    application: "Auth"
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new SeqTransport({
      serverUrl: "http://seq:5341",
      // apiKey: "your-api-key",
      onError: (e => { console.error("SEQ ERROR: ", e) }),
      handleExceptions: true,
      handleRejections: true,
    })
  ]
});

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test',
    secure: false,
  })
);

app.use(metricsMiddleware)

app.use('/api/users/hello', (req, res) => {
  res.json({
    'Hello': "World!"
  })
})

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);


export { app, logger };
