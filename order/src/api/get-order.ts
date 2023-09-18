import { NotFoundError, currentUser, requireAuth } from '@sobhankiani/e-shop-common';
import express from 'express';
import { Order } from '../models/order-aggregat/order';

const router = express.Router()

router.get('/api/orders/:id', currentUser, requireAuth, async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
    if (!order) {
        throw new NotFoundError();
    }

    order.setCancelledStatus();
})

export { router as getOrderRouter }