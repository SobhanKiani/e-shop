import { currentUser, requireAuth } from '@sobhankiani/e-shop-common';
import express from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order-aggregat/order';

const router = express.Router();

router.post("/api/orders/draft",
    [
        body('orderItems.*.prodcutId').notEmpty(),
        body('orderItems.*.productName').notEmpty(),
        body('orderItems.*.unitPrice').notEmpty(),
        body('orderItems.*.discount').notEmpty(),
        body('orderItems.*.units').notEmpty(),
    ],
    currentUser, requireAuth, async (req, res) => {
        const order = Order.fromDraft()
        order.buyerId = req.currentUser.id
        const orderItems = req.body.orderItems;

        for (const oi of orderItems) {
            order.addOrderItem(
                oi.prodcutId,
                oi.productName,
                oi.unitPrice,
                oi.discount,
                oi.units
            )
        }
        res.send(order)
    })

export { router as createOrderDraftFromBaketRouter }