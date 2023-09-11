import express from 'express';
import { CatalogItem } from '../models/CatalogItem';
import { NotFoundError, currentUser, requireAuth } from '@sobhankiani/e-shop-common';
import { check } from 'express-validator';
import { ProductPriceChangedPublisher } from '../events/publishers/ProductPriceChangedPublisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router()

router.put('/api/items/:id',
    [
        check('name').isString(),
        check('description').isString(),
        check('price').isNumeric(),
        check('pictureFileName').isString(),
        check('pictureURI').isString(),
        check('catalogType').isMongoId(),
        check('catalogBrand').isMongoId(),
        check('availableStock').isNumeric(),
        check('restockThreshold').isNumeric(),
        check('maxStockThreshold').isNumeric(),
        check('onReorder').isBoolean(),
    ]
    , currentUser, requireAuth, async (req, res) => {
        const id = req.params.id;
        const itemUpdateData = req.body;

        const item = await CatalogItem.findById(id);
        if (!item) {
            throw new NotFoundError();
        }

        const oldPrice = item.price;
        item.set(itemUpdateData);
        let raiseProductChangeEvent = item.price != oldPrice;

        if (raiseProductChangeEvent) {
            new ProductPriceChangedPublisher(natsWrapper.client).publish({
                productId: item.id,
                oldPrice,
                newPrice: item.price,
                version: item.version
            })
        }

        await item.save();
        res.send(item);
    })

export { router as updateProductRouter };