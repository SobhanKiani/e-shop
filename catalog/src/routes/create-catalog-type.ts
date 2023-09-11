import express from 'express';
import { currentUser, requireAuth, validateRequest } from '@sobhankiani/e-shop-common';
import { body } from 'express-validator';
import { CatalogType } from '../models/CatalogType'

const router = express.Router();

router.post('/api/items/type/', [
    body("type").notEmpty().isString(),
], validateRequest, currentUser, requireAuth, async (req, res) => {
    const { type } = req.body;
    const newCatalogBrand = CatalogType.build({
        type
    });
    await newCatalogBrand.save();

    res.status(201).send(newCatalogBrand);
})

export { router as createCatalogTypeRouter }