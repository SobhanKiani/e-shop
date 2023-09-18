import mongoose from 'mongoose';
// import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// enum ORDER_STATUS_ENUM {
//     Submitted = 'Submitted',
//     AwaitingValidation = 'AwaitingValidation',
//     StockConfirmed = 'StockConfirmed',
//     Paid = 'Paid',
//     Shipped = 'Shipped',
//     Cancelled = 'Cancelled'
// }

// interface OrderStatusAttrs {
//     name: string
// }

// interface OrderStatusDoc extends mongoose.Document {
//     name: string
//     version: number;
// }

// interface OrderStatusModel extends mongoose.Model<OrderStatusDoc> {
//     build(attrs: OrderStatusAttrs): OrderStatusDoc;
// }

// const OrderStatusSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         enum: ORDER_STATUS_ENUM
//     },

// },
//     {
//         toJSON: {
//             transform(doc, ret) {
//                 ret.id = ret._id;
//                 delete ret._id
//             },
//             virtuals: true
//         }
//     }
// )


// OrderStatusSchema.set('versionKey', 'version');
// OrderStatusSchema.plugin(updateIfCurrentPlugin);


// OrderStatusSchema.statics.build = (attrs: OrderStatusAttrs) => {
//     return new OrderStatus(attrs);
// };

// const OrderStatus = mongoose.model<OrderStatusDoc, OrderStatusModel>('OrderStatus', OrderStatusSchema);

// export { OrderStatus, OrderStatusDoc, ORDER_STATUS_ENUM }

class OrderStatus {
    name: string;
    id: number;
    constructor(id, name) {
        this.name = name;
        this.id = id
    }
}

class OrderStatusEnum {
    static Submited = new OrderStatus(1, 'Submitted')
    static AwaitingValidation = new OrderStatus(2, 'AwaitingValidation')
    static StockConfirmed = new OrderStatus(3, 'StockConfirmed')
    static Paid = new OrderStatus(4, 'Paid')
    static Shipped = new OrderStatus(5, 'Shipped')
    static Cancelled = new OrderStatus(6, 'Cancelled')
    private static statusList = [this.Submited, this.AwaitingValidation, this.StockConfirmed, this.Paid, this.Shipped, this.Cancelled]

    fromName() {

    }

    fromId() {

    }

}

const orderStatusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
})

export { OrderStatusEnum, OrderStatus, orderStatusSchema }