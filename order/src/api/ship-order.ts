import { NotFoundError, currentUser, requireAuth, validateRequest } from '@sobhankiani/e-shop-common';
import express from 'express';
import { param } from 'express-validator';
import { Order } from '../models/order-aggregat/order';

const router = express.Router();

router.put('/api/orders/:id/ship',
    [
        param('id').isMongoId()
    ],
    validateRequest, currentUser, requireAuth, async (req, res) => {
        const orderId = req.params.id;
        const order = await Order.findById(orderId)
        if (!order ) {
            throw new NotFoundError();
        }

        order.setShippedStatus();
        res.send(`Order ${orderId} Shipped`);
    }
)

export { router as shipOrderRouter };