import { BadRequestError, currentUser, requireAuth, validateRequest } from '@sobhankiani/e-shop-common';
import express from 'express';
import { v4 as uuidv4 } from 'uuid'
import { CustomerBasket } from '../models/customer-basket';
import { UserCheckoutAcceptedPublisher } from '../events/publishers/UserCheckoutAcceptedEventPublisher';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import { BasketCheckout } from '../models/basket-checkout';

const router = express.Router();

router.post('/api/basket/checkout',
    [
        body('city').notEmpty().isString(),
        body('street').notEmpty().isString(),
        body('state').notEmpty().isString(),
        body('country').notEmpty().isString(),
        body('zipCode').notEmpty().isString(),
        body('cardNumber').notEmpty().isString(),
        body('cardHolderName').notEmpty().isString(),
        body('cardExpiration').notEmpty().isISO8601().toDate(),
        body('cardSecurityNumber').notEmpty().isString(),
        body('cardTypeId').notEmpty().isNumeric(),
    ]
    , validateRequest, currentUser, requireAuth, async (req, res) => {
        const { city, street, state, country, zipCode, cardNumber, cardExpiration, cardHolderName, cardSecurityNumber, cardTypeId } = req.body
        const userName = req.currentUser?.name;
        const userId = req.currentUser?.id;

        const requestId = uuidv4();

        let basket = await CustomerBasket.findOne({ buyerId: userId });
        if (!basket) {
            throw new BadRequestError("No basket for the user");
        }

        const basketCheckout = BasketCheckout.build({
            city,
            street,
            state,
            country,
            zipCode,
            cardNumber,
            cardHolderName,
            cardExpiration,
            cardSecurityNumber,
            cardTypeId,
            basket: basket.id,
            buyer: userId,
            requestId
        });
        await basketCheckout.save();

        new UserCheckoutAcceptedPublisher(natsWrapper.client).publish({
            userId,
            userName,
            city,
            street,
            state,
            country,
            zipCode,
            cardNumber,
            cardHolderName,
            cardExpiration,
            cardSecurityNumber,
            cardTypeId,
            basket: basket.id,
            buyer: userId,
            requestId
        })

        res.status(200).send({ "result": "Checkout Accpeted" })

    })

export { router as checkoutRouter }