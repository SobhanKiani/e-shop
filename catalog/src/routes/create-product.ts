import express from 'express';
import { CatalogItem } from '../models/CatalogItem';
import { currentUser, requireAuth, validateRequest } from '@sobhankiani/e-shop-common';
import { body } from 'express-validator';
import { itemListRouter } from './items';

const router = express.Router();

router.post('/api/items/', [
    body("name").notEmpty().isString(),
    body("description").notEmpty().isString(),
    body("price").notEmpty().isNumeric(),
    // body("pictureFileName").isString(),
    // body("pictureUri").isString(),
    body("catalogBrand").notEmpty().isMongoId(),
    body("catalogType").notEmpty().isMongoId(),
    body("availableStock").notEmpty().isNumeric(),
    body("restockThreshold").notEmpty().isNumeric(),
    body("maxRestockThreshold").notEmpty().isNumeric(),
    body("onReorder").notEmpty().isBoolean(),
], validateRequest, currentUser, requireAuth, async (req, res) => {
    const { name, description, price, pictureFileName, pictureUri, catalogBrand, catalogType, availableStock, restockThreshold, maxRestockThreshold, onReorder } = req.body;
    const item = CatalogItem.build({
        name,
        description,
        price,
        pictureFileName,
        pictureUri,
        catalogType,
        catalogBrand,
        availableStock,
        restockThreshold,
        maxRestockThreshold,
        onReorder
    });

    await item.save();
    item.populate('catalogType').populate('catalogBrand');
    res.status(201).send(item);
})

export { router as createProductRouter }