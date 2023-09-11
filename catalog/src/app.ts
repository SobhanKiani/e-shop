import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@sobhankiani/e-shop-common';
import promBundle from 'express-prom-bundle';

import { getTypesRouter } from './routes/get-types';
import { createCatalogTypeRouter } from './routes/create-catalog-type';
import { createCatalogBrandRouter } from './routes/create-brand';
import { createProductRouter } from './routes/create-product';
import { updateProductRouter } from './routes/update-product';
import { getItemByIdRouter } from './routes/item-by-id';
import { getItemsByNameRouter } from './routes/item-by-name';
import { itemListRouter } from './routes/items';
import { getItemsByBrand } from './routes/items-by-brand';
import { getItemByTypeAndBrand } from './routes/items-by-type-and-brand';


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


app.use(itemListRouter);
app.use(getTypesRouter);
app.use(createCatalogTypeRouter);
app.use(createCatalogBrandRouter);
app.use(createProductRouter);
app.use(updateProductRouter);
app.use(getItemByIdRouter);
app.use(getItemsByNameRouter);
app.use(getItemsByBrand);
app.use(getItemByTypeAndBrand);

app.use('/api/catalog/hello', (req, res) => {
  res.json({
    'Hello': "World!"
  })
});

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
