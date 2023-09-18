import { Listener, OrderStatusChangedToPaidDomainEvent, OrderDomainEventSubjects } from "@sobhankiani/e-shop-common";
import { queueGroupNameDomainEvents } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-aggregat/order";
import { Buyer } from "../../models/buyer-aggregate/buyer";
import { OrderItem, OrderItemDoc } from "../../models/order-aggregat/orderItems";
import { OrderStatusChangedToPaidPublisher } from "../../events/publishers/order-status-changed-to-paid.publihser";
import { natsWrapper } from "../../nats-wrapper";

export class OrderStatusChangedToPaidDomainEventListener extends Listener<OrderStatusChangedToPaidDomainEvent>{
    subject: OrderDomainEventSubjects.OrderStatusChangedToPaidDomainEvent = OrderDomainEventSubjects.OrderStatusChangedToPaidDomainEvent;
    queueGroupName: string = queueGroupNameDomainEvents;

    async onMessage(data: { orderId: string; orderItems: any; }, msg: Message) {
        const order = await Order.findById(data.orderId);
        const buyer = await Buyer.findOne({ userId: order?.buyerId });

        if (order && buyer) {

            new OrderStatusChangedToPaidPublisher(natsWrapper.client).publish({
                orderId: order.id,
                version: order.version,
                orderStockItems: data.orderItems.map((oi) => {
                    return {
                        productId: oi.productId,
                        version: oi.version,
                        units: oi.units
                    }
                }),
                buyerName: buyer.name
            })
        }

    }
}