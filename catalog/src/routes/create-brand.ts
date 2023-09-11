import express from 'express';
import { CatalogItem } from '../models/CatalogItem';
import { currentUser, requireAuth, validateRequest } from '@sobhankiani/e-shop-common';
import { body } from 'express-validator';
import { itemListRouter } from './items';
import { CatalogBrand } from '../models/CatalogBrand';

const router = express.Router();

router.post('/api/items/brand/', [
    body("brand").notEmpty().isString(),
], validateRequest, currentUser, requireAuth, async (req, res) => {
    const { brand } = req.body;
    const newCatalogBrand = CatalogBrand.build({
        brand
    });

    await newCatalogBrand.save();
    console.log(newCatalogBrand);
    res.status(201).send(newCatalogBrand);
})

export { router as createCatalogBrandRouter }