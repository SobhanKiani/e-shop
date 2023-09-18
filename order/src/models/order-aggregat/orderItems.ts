import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderItemAttrs {
    productName: string;
    productId: string;
    unitPrice: number;
    discount: number;
    units: number;
}

interface OrderItemDoc extends mongoose.Document {
    productName: string;
    productId: string;
    unitPrice: number;
    discount: number;
    units: number;
    version: number;
}

interface OrderItemModel extends mongoose.Model<OrderItemDoc> {
    build(attrs: OrderItemAttrs): OrderItemDoc;
}

const OrderItemSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    units: {
        type: Number,
        required: true,
        min: 1
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


OrderItemSchema.set('versionKey', 'version');
OrderItemSchema.plugin(updateIfCurrentPlugin);

OrderItemSchema.statics.build = (attrs: OrderItemAttrs) => {
    return new OrderItem(attrs);
};

const OrderItem = mongoose.model<OrderItemDoc, OrderItemModel>('OrderItem', OrderItemSchema);

export { OrderItem, OrderItemDoc }