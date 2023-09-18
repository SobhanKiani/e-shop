import express from 'express';
import { CardType } from '../models/buyer-aggregate/cardType';

const router = express.Router();

router.get('/api/orders/cardTypes', async (req, res) => {
    const cardTypes = await CardType.find({});
    res.send(cardTypes);
})

export { router as getCardsRouter }