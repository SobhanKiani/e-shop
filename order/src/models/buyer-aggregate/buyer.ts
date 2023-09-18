import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { PaymentMethod, PaymentMethodDoc } from './paymentMethod'

interface BuyerAttrs {
    name: string;
    userId: string
}

interface BuyerDoc extends mongoose.Document {
    name: string;
    userId: string;
    paymentMethods: [PaymentMethodDoc],
    version: number;
    verifyOrAddPaymentMethod(paymentMethod: {
        cardNumber: string,
        securityNumber: string,
        cardHolderName: string,
        expiration: Date,
        cardType: string,
        orderId: string;
    })
}

interface BuyerModel extends mongoose.Model<BuyerDoc> {
    build(attrs: BuyerAttrs): BuyerDoc;
}

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    paymentMethods: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PaymentMethod",
        }
    ]
},
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id
            },
            virtuals: true
        }
    }
)


buyerSchema.set('versionKey', 'version');
buyerSchema.plugin(updateIfCurrentPlugin);


buyerSchema.statics.build = (attrs: BuyerAttrs): BuyerDoc => {
    return new Buyer(attrs);
};

buyerSchema.methods.verifyOrAddPaymentMethod = async function (paymentMethodData: {
    cardType: string, alias: string, cardNumber: string, securityNumber: string, cardHolderName: string, expiration: Date
}, orderId: string) {
    const buyer = this as BuyerDoc;
    const existingPaymentMethod = buyer.paymentMethods.find((pm: PaymentMethodDoc) =>
        pm.isEqual(pm.cardType._id, pm.cardNumber, pm.expiration)
    );

    // payment method verified domain event 
    if (existingPaymentMethod) {
        // Payment method already exists, perform verification or update if necessary
        // Implement your logic here

        return existingPaymentMethod;
    } else {
        // Payment method does not exist, add it to the buyer's paymentMethods array
        const newPayment = PaymentMethod.build(paymentMethodData)
        await newPayment.save();

        buyer.paymentMethods.push(newPayment);
        await buyer.save();
        return newPayment;
    }


};


const Buyer = mongoose.model<BuyerDoc, BuyerModel>('Buyer', buyerSchema);

export { Buyer }