import { NotFoundError, currentUser, requireAuth } from '@sobhankiani/e-shop-common';
import express from 'express';
import { Order } from '../models/order-aggregat/order';

const router = express.Router()

router.get('/api/orders/', currentUser, requireAuth, async (req, res) => {
    const orders = await Order.find({ buyerId: req.currentUser?.id });
    res.send(orders);
})

export { router as getOrdersRouter }