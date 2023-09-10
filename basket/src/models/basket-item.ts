import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface BaksetItemAttrs {
    basket: string;
    productId: string;
    productName: string;
    unitPrice: number;
    oldUnitPrice: number;
    quantity: number;
    pictureUrl: string;
}

interface BasketItemDoc extends mongoose.Document {
    basket: string;
    productId: string;
    productName: string;
    unitPrice: number;
    oldUnitPrice: number;
    quantity: number;
    pictureUrl: string;
    version: number;
}

interface BasketItemModel extends mongoose.Model<BasketItemDoc> {
    build(attrs: BaksetItemAttrs): BasketItemDoc;
}

const basketItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    oldUnitPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    pictureUrl: {
        type: String,
        required: true,
    },

    basket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomerBasket'
    }

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

basketItemSchema.set('versionKey', 'version');
basketItemSchema.plugin(updateIfCurrentPlugin);

basketItemSchema.statics.build = (attrs: BaksetItemAttrs) => {
    return new BasketItem(attrs);
};

const BasketItem = mongoose.model<BasketItemDoc, BasketItemModel>('BasketItem', basketItemSchema);

export { BasketItem, BasketItemDoc };