import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@sobhankiani/e-shop-common';
import promBundle from 'express-prom-bundle';

import { customerBasketByIdRouter } from './routes/get-by-id'
import { deleteBasketRouter } from './routes/delete-basket'
import { updateBasketRouter } from './routes/update-basket'
import { checkoutRouter } from './routes/checkout';


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

app.use(customerBasketByIdRouter);
app.use(deleteBasketRouter);
app.use(updateBasketRouter);
app.use(checkoutRouter)

app.use('/api/basket/hello', (req, res) => {
  res.json({
    'Hello': "World!"
  })
});

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
