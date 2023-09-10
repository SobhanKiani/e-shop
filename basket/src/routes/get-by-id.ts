import express from 'express';
import { NotAuthorizedError, currentUser, requireAuth } from '@sobhankiani/e-shop-common';
import { CustomerBasket } from '../models/customer-basket';

const router = express.Router()

router.get('/api/basket/', currentUser, requireAuth, async (req, res) => {
    const buyerId = req.currentUser?.id
    
    if (!buyerId) {
        throw new NotAuthorizedError()
    }

    let basket = await CustomerBasket.findOne({ buyerId }).populate('basketItems');
    console.log(basket)
    if (basket == null) {
        basket = CustomerBasket.build({
            buyerId: buyerId,
        });

        await basket.save();
    }
    res.status(200).send(basket);
})

export { router as customerBasketByIdRouter }