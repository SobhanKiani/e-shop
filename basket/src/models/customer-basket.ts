import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { BasketItemDoc } from './basket-item';

interface CustomerBaksetAttrs {
    buyerId: string;
}

interface CustomerBasketDoc extends mongoose.Document {
    buyerId: string;
    basketItems: BasketItemDoc[];
    version: number;
}

interface CustomerBasketModel extends mongoose.Model<CustomerBasketDoc> {
    build(attrs: CustomerBaksetAttrs): CustomerBasketDoc;
}

const customerBasketSchema = new mongoose.Schema({
    buyerId: {
        type: String,
        required: true
    },
    // basketItems: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'BasketItem'
    // }]
},
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
            virtuals: true
        },
    }
)

customerBasketSchema.set('versionKey', 'version');
customerBasketSchema.plugin(updateIfCurrentPlugin);

customerBasketSchema.virtual('basketItems', {
    ref: "BasketItem",
    localField: '_id',
    foreignField: "basket"
})

customerBasketSchema.statics.build = (attrs: CustomerBaksetAttrs) => {
    return new CustomerBasket(attrs);
};

const CustomerBasket = mongoose.model<CustomerBasketDoc, CustomerBasketModel>('CustomerBasket', customerBasketSchema);

export { CustomerBasket, CustomerBasketDoc };