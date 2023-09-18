import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CardTypeDoc } from './cardType';

interface PaymentMethodAttrs {
    alias: string;
    cardNumber: string;
    securityNumber: string;
    cardHolderName: string;
    expiration: Date;
    cardType: string;
}

interface PaymentMethodDoc extends mongoose.Document {
    name: string;
    alias: string;
    cardNumber: string;
    securityNumber: string;
    cardHolderName: string;
    expiration: Date;
    cardType: CardTypeDoc;
    version: number;
    isEqual(cardTypeId: string, cardNumber: string, expiration: Date): boolean
}

interface PaymentMethodModel extends mongoose.Model<PaymentMethodDoc> {
    build(attrs: PaymentMethodAttrs): PaymentMethodDoc;
}

const PaymentMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    alias: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    securityNumber: {
        type: String,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    },
    expiration: {
        type: Date,
        required: true,
        default: Date.now()
    },
    cardType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CardType'
    },
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


PaymentMethodSchema.set('versionKey', 'version');
PaymentMethodSchema.plugin(updateIfCurrentPlugin);

PaymentMethodSchema.statics.build = (attrs: PaymentMethodAttrs) => {
    return new PaymentMethod(attrs);
};

PaymentMethodSchema.methods.isEqual = function (cardTypeId, cardNumber, expiration) {
    const pm = this as PaymentMethodDoc
    if (
        pm.cardNumber == cardNumber &&
        pm.expiration == expiration &&
        pm.cardType._id == cardTypeId
    ) {
        return true;
    } else {
        return false;
    }
}

const PaymentMethod = mongoose.model<PaymentMethodDoc, PaymentMethodModel>('PaymentMethod', PaymentMethodSchema);

export { PaymentMethod, PaymentMethodDoc }