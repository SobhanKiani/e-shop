import { OrderCancelledDomainEvent, OrderDomainEventSubjects, Listener } from "@sobhankiani/e-shop-common";
import { Message } from "node-nats-streaming";
import { queueGroupNameDomainEvents } from "./queueGroupName";
import { Order } from "../../models/order-aggregat/order";
import { OrderStatusChangedToCancelledPublisher } from "../../events/publishers/order-status-changed-to-cancelled.publisher";
import { natsWrapper } from "../../nats-wrapper";
import { Buyer } from "../../models/buyer-aggregate/buyer";

export class OrderCancelledDomainEventListener extends Listener<OrderCancelledDomainEvent>{
    subject: OrderDomainEventSubjects.OrderCancelledDomainEvent = OrderDomainEventSubjects.OrderCancelledDomainEvent;
    queueGroupName: string = queueGroupNameDomainEvents;
    async onMessage(data: OrderCancelledDomainEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (order) {
            const buyer = await Buyer.findOne({ userId: order?.buyerId })
            if (buyer) {
                new OrderStatusChangedToCancelledPublisher(natsWrapper.client).publish({
                    orderId: order.id,
                    orderStatus: order.orderStatus.name,
                    buyerName: buyer.name
                })
            }
        }
    }
}