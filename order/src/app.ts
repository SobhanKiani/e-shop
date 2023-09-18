import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@sobhankiani/e-shop-common';
import promBundle from 'express-prom-bundle';

import { cancelOrderRouter } from './api/cancel-order';
import { createOrderDraftFromBaketRouter } from './api/create-order-draft-from-basket';
import { getCardsRouter } from './api/get-card-types';
import { getOrderRouter } from './api/get-order';
import { getOrdersRouter } from './api/get-orders';
import { shipOrderRouter } from './api/ship-order';

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

app.use(cancelOrderRouter)
app.use(createOrderDraftFromBaketRouter)
app.use(getCardsRouter)
app.use(getOrderRouter)
app.use(getOrdersRouter)
app.use(shipOrderRouter)

app.use('/api/users/hello', (req, res) => {
  res.json({
    'Hello': "World!"
  })
})

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);


export { app };
