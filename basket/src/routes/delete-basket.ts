import express from 'express';
import { NotAuthorizedError, NotFoundError, currentUser, requireAuth } from '@sobhankiani/e-shop-common';
import { CustomerBasket } from './../models/customer-basket'

const router = express.Router();

router.delete('/api/basket/', currentUser, requireAuth, async (req, res) => {
    const userId = req.currentUser?.id
    if (!userId) {
        throw new NotAuthorizedError();
    }

    const result = await CustomerBasket.findOneAndDelete({ buyerId: userId })
    if (result == null) {
        throw new NotFoundError();
    }

    res.status(200).send(result);
});

router.delete('/api/basket/:id', currentUser, requireAuth, async (req, res) => {
    const userId = req.params.id;

    const result = await CustomerBasket.findOneAndDelete({ buyerId: userId })
    if (result == null) {
        throw new NotFoundError();
    }

    res.status(200).send(result);
});

export { router as deleteBasketRouter }