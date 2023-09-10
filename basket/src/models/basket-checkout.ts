import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CustomerBasketDoc } from './customer-basket';

interface BasketCheckoutAtrrs {
    city: string;
    street: string;
    state: string;
    country: string;
    zipCode: string;
    cardNumber: string;
    cardHolderName: string;
    cardExpiration: Date;
    cardSecurityNumber: String;
    cardTypeId: number;
    buyer: string;
    requestId: string;
    basket: CustomerBasketDoc;
}

interface BasketCheckoutDoc extends mongoose.Document {
    city: string;
    street: string;
    state: string;
    country: string;
    zipCode: string;
    cardNumber: string;
    cardHolderName: string;
    cardExpiration: Date;
    cardSecurityNumber: String;
    cardTypeId: number;
    buyer: string;
    requestId: string;
    basket: CustomerBasketDoc;
    version: number;
}

interface BasketCheckoutModel extends mongoose.Model<BasketCheckoutDoc> {
    build(attrs: BasketCheckoutAtrrs): BasketCheckoutDoc;
}

const basketCheckoutSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    },
    cardExpiration: {
        type: Date,
        required: true
    },
    cardSecurityNumber: {
        type: String,
        required: true
    },
    cardTypeId: {
        type: Number,
        required: true
    },
    buyer: {
        type: String,
        required: true
    },
    requestId: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: true
    },
    basket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomerBasket"
    }
});

basketCheckoutSchema.set('versionKey', 'version');
basketCheckoutSchema.plugin(updateIfCurrentPlugin);

basketCheckoutSchema.statics.build = (attrs: BasketCheckoutAtrrs) => {
    return new BasketCheckout(attrs);
};

const BasketCheckout = mongoose.model<BasketCheckoutDoc, BasketCheckoutModel>('BasketCheckout', basketCheckoutSchema);

export { BasketCheckout };
