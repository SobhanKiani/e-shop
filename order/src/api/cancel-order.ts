import { NotFoundError, currentUser, requireAuth, validateRequest } from '@sobhankiani/e-shop-common';
import express from 'express';
import { Order } from '../models/order-aggregat/order';
import { param } from 'express-validator';

const router = express.Router()

router.put('/api/orders/:id/cancel',
    [
        param('id').isMongoId()
    ],
    validateRequest, currentUser, requireAuth, async (req, res) => {

        const orderId = req.params.id;
        const order = await Order.findById(orderId)
        if (!order) {
            throw new NotFoundError();
        }

        order.setCancelledStatus();
        res.send(`Order ${orderId} Cancelled`);
    }
)

export { router as cancelOrderRouter }