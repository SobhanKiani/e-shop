import express from 'express';
import { BadRequestError, NotAuthorizedError, NotFoundError, currentUser, requireAuth, validateRequest } from '@sobhankiani/e-shop-common';
import { CustomerBasket } from '../models/customer-basket';
import { BasketItem } from '../models/basket-item';
import { body, check } from 'express-validator';
import mongoose from 'mongoose';
import e from 'express';


const router = express.Router()


router.post('/api/basket/',
    [
        body('basketItem.productId').notEmpty().isString(),
        body('basketItem.productName').notEmpty().isString(),
        body('basketItem.unitPrice').notEmpty().isNumeric(),
        body('basketItem.oldUnitPrice').notEmpty().isNumeric(),
        body('basketItem.quantity').notEmpty().isNumeric().custom((value, { req }) => {
            if (parseFloat(value) < 0) {
                throw new Error("Quantity should not be less than 0")
            }
        }),
        body('basketItem.Id').isMongoId()
    ], validateRequest, currentUser, requireAuth,
    async (req, res) => {
        const userId = req.currentUser?.id;
        const basket = await CustomerBasket.findOne({ buyerId: userId });
        if (!basket) {
            throw new NotFoundError();
        }

        let basketItemData = req.body.basketItem;
        let basketItem;

        if (!basketItemData.id) {
            if (basketItemData.quantity < 1) {
                throw new BadRequestError("Quantity cant'b 0")
            }
            basketItem = BasketItem.build({
                basket: basket.id,
                oldUnitPrice: basketItemData.oldUnitPrice,
                unitPrice: basketItemData.unitPrice,
                pictureUrl: basketItemData.pictureUrl,
                productId: basketItemData.productId,
                productName: basketItemData.productName,
                quantity: basketItemData.quantity
            });

            await basketItem.save()
            // basketItem = await basketItem.populate('basket');
        }
        else {
            if (basketItemData.quantity != 0) {
                basketItem = await BasketItem.findById(basketItemData.id);
                basketItem.set({
                    oldUnitPrice: basketItemData.oldUnitPrice,
                    unitPrice: basketItemData.unitPrice,
                    pictureUrl: basketItemData.pictureUrl,
                    productId: basketItemData.productId,
                    productName: basketItemData.productName,
                    quantity: basketItemData.quantity
                });
                basketItem = await basketItem.save()
            } else {
                basketItem = await BasketItem.findByIdAndDelete(basketItemData.id);
                if (!basketItem) {
                    throw new NotFoundError()
                }
            }
        }
        res.status(200).send(basketItem);
    }
)

export { router as updateBasketRouter } 