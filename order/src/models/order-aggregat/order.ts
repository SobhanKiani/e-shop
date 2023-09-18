import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { AddressDoc } from './address';
import { OrderStatusEnum, OrderStatus, orderStatusSchema } from './orderStatus';
import { OrderItem, OrderItemDoc } from './orderItems';
import { PaymentMethodDoc } from '../buyer-aggregate/paymentMethod';
import { OrderCancelledDomainEventPublihser } from '../../domain-events/publishers/order-cancelled-domain-event.publisher';
import { natsWrapper } from '../../nats-wrapper';
import { OrderShippedDomainEventPublisher } from '../../domain-events/publishers/order-shipped-domain-event.publiser';
import { OrderStatusChangedToPaidDomainEventPublisher } from '../../domain-events/publishers/order-status-changed-to-paid-domain-event.publisher';
import { OrderStatusChangedToStockConfirmedDomainEventPublisher } from '../../domain-events/publishers/order-status-changed-to-stock-confirmed-domain-event.publisher';
import { OrderStatusChangedToAwaitingValidationDomainEventPublisher } from '../../domain-events/publishers/order-status-changedToAwaitingValidation-domain-event.publisher';

interface OrderAttrs {
    address: AddressDoc,
    date: Date,
    buyerId: string,
    // orderStatus: OrderStatus,
    // orderStatus: {
    //     name: string,
    //     id: number,
    // }
    description: string,
    isDraft?: boolean,
    // orderItems: [OrderItemDoc],
    paymentMethodId?: string,
}

interface OrderDoc extends mongoose.Document {
    address: AddressDoc,
    date: Date,
    buyerId: string,
    orderStatus: {
        id: number,
        name: string
    },
    description: string,
    isDraft: boolean;
    orderItems: [OrderItemDoc],
    version: number,
    paymentMethodId?: string,

    addOrderItem(
        productId: string,
        productName: string,
        unitPrice: number,
        discount: number,
        units: number
    ): OrderItemDoc;
    setAwaitingValidationStatus(): void;
    setStockConfirmedStatus(): void;
    setPaidStatus(): void;
    setShippedStatus(): void;
    setCancelledStatus(): void;
    setCancelledStatus(rejectedItems: any): void;
    addOrderStartedDomainEvent(): void
    getTotal(): number;
    setCancelledStatusWhenOrderIsRejected(rejectedItems: any): void

}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
    fromDraft(): OrderDoc
}

const OrderSchema = new mongoose.Schema({
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    date: {
        type: Date,
        default: new Date()
    },
    buyerId: {
        type: String,
        required: true
    },
    orderStatus: orderStatusSchema,
    description: {
        type: String,
        required: true
    },
    isDraft: {
        type: Boolean,
        default: false
    },
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem"
    }],
    paymentMethodId: {
        type: String,
        required: false
    }

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


OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);


OrderSchema.statics.build = (attrs: OrderAttrs) => {
    const submittedOrderStatusId = OrderStatusEnum.Submited.id
    return new Order({
        ...attrs,
        isDraft: attrs.isDraft || false,
        orderStatus: submittedOrderStatusId,
    });
};

OrderSchema.statics.fromDraft = (attrs: OrderAttrs) => {
    return new Order({ isDraft: true });
};

OrderSchema.methods.addOrderItem = async function (
    productId: string,
    productName: string,
    unitPrice: number,
    discount: number,
    units: number = 1
) {
    const order: OrderDoc = this as OrderDoc;
    order.populate('orderItems');

    const existingOrderForProduct = order.orderItems.find((oi: OrderItemDoc) => oi._id == productId);

    if (existingOrderForProduct) {
        if (discount > existingOrderForProduct.discount) {
            existingOrderForProduct.discount = discount;
        }
        existingOrderForProduct.units = units
        return existingOrderForProduct
    } else {
        const orderItem = OrderItem.build({ discount, productName, unitPrice, units, productId });
        await orderItem.save();

        order.orderItems.push(orderItem);
        await order.save();
        return orderItem
    }
}

OrderSchema.methods.setAwaitingValidationStatus = async function () {
    const order: OrderDoc = this as OrderDoc;
    if (order.orderStatus.id == OrderStatusEnum.Submited.id) {
        // OrderStatusChangedToAwaitingValidationDomainEvent
        new OrderStatusChangedToAwaitingValidationDomainEventPublisher(natsWrapper.client).publish({
            orderId: order.id,
            orderItems: order.orderItems.map((oi) => {
                return {
                    prodcutName: oi.productName,
                    prodcutId: oi.productId,
                    units: oi.units,
                    unitPrice: oi.unitPrice,
                    discount: oi.discount
                }
            })
        })

        order.orderStatus.id = OrderStatusEnum.AwaitingValidation.id
        order.orderStatus.name = OrderStatusEnum.AwaitingValidation.name
        await order.save();
    }
}

OrderSchema.methods.setStockConfirmedStatus = async function () {
    const order: OrderDoc = this as OrderDoc;
    if (order.orderStatus.id == OrderStatusEnum.AwaitingValidation.id) {
        // OrderStatusChangedToStockConfirmedDomainEvent
        new OrderStatusChangedToStockConfirmedDomainEventPublisher(natsWrapper.client).publish({
            orderId: order.id
        })

        order.description = "All the items were confirmed with available stock.";
        order.orderStatus.id = OrderStatusEnum.StockConfirmed.id
        order.orderStatus.name = OrderStatusEnum.StockConfirmed.name
        await order.save()
    }
}

OrderSchema.methods.setPaidStatus = async function () {
    const order: OrderDoc = this as OrderDoc;
    if (order.orderStatus.id == OrderStatusEnum.StockConfirmed.id) {
        // OrderStatusChangedToPaidDomainEvent
        new OrderStatusChangedToPaidDomainEventPublisher(natsWrapper.client).publish({
            orderId: order.id,
            orderItems: order.orderItems.map((oi) => {
                return {
                    prodcutName: oi.productName,
                    prodcutId: oi.productId,
                    units: oi.units,
                    unitPrice: oi.unitPrice,
                    discount: oi.discount
                }
            })
        })

        order.description = "The payment was performed at a simulated \"American Bank checking bank account ending on XX35071\"";
        order.orderStatus.id = OrderStatusEnum.Paid.id
        order.orderStatus.name = OrderStatusEnum.Paid.name
        await order.save()
    }
}

OrderSchema.methods.setShippedStatus = async function () {
    const order: OrderDoc = this as OrderDoc;
    if (order.orderStatus.id == OrderStatusEnum.Paid.id) {
        order.description = "The order was shipped.";
        order.orderStatus.id = OrderStatusEnum.Shipped.id
        order.orderStatus.name = OrderStatusEnum.Shipped.name
        await order.save()

        // OrderShippedDomainEvent
        new OrderShippedDomainEventPublisher(natsWrapper.client).publish({
            orderId: order.id
        })
    }
}

OrderSchema.methods.setCancelledStatus = async function () {
    const order: OrderDoc = this as OrderDoc;
    if (order.orderStatus.id == OrderStatusEnum.Paid.id || order.orderStatus.id == OrderStatusEnum.Shipped.id) {
        throw new Error("Can't be cancelled after Paying or Shipping");
    }
    order.description = "The order was cancelled.";
    order.orderStatus.id = OrderStatusEnum.Cancelled.id;
    order.orderStatus.name = OrderStatusEnum.Cancelled.name;
    await order.save();

    // OrderCancelledDomainEvent
    new OrderCancelledDomainEventPublihser(natsWrapper.client).publish({
        orderId: order.id
    })
}
OrderSchema.methods.setCancelledStatusWhenOrderIsRejected = async function (rejectedItems: [OrderItemDoc]) {
    const order: OrderDoc = this as OrderDoc;
    if (order.orderStatus.id == OrderStatusEnum.AwaitingValidation.id) {
        order.description = "Some products are not in the stock";
        order.orderStatus.id = OrderStatusEnum.Cancelled.id;
        order.orderStatus.name = OrderStatusEnum.Cancelled.name;
        await order.save();
    }

    // OrderCancelledDomainEvent
    new OrderCancelledDomainEventPublihser(natsWrapper.client).publish({
        orderId: order.id
    })
}

OrderSchema.methods.getTotal = async function () {
    const order: OrderDoc = this as OrderDoc;
    let total = 0;
    for (const oi of order.orderItems) {
        total += oi.units * oi.unitPrice;
    }
    return total
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order, OrderDoc }