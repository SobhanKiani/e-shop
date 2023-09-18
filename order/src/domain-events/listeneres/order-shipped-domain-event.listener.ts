import { OrderDomainEventSubjects, OrderShippedDomainEvent, Listener } from "@sobhankiani/e-shop-common";
import { queueGroupNameDomainEvents } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-aggregat/order";
import { Buyer } from "../../models/buyer-aggregate/buyer";
import { OrderStatusChangedToShippedPublisher } from "../../events/publishers/order-status-changed-to-shipped.publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderShippedDomainEventListener extends Listener<OrderShippedDomainEvent>{
    subject: OrderDomainEventSubjects.OrderShippedDomainEvent = OrderDomainEventSubjects.OrderShippedDomainEvent;
    queueGroupName: string = queueGroupNameDomainEvents;
    async onMessage(data: { orderId: string; }, msg: Message) {
        const order = await Order.findById(data.orderId);
        if (order) {
            const buyer = await Buyer.findOne({ userId: order?.buyerId })
            if (buyer) {
                new OrderStatusChangedToShippedPublisher(natsWrapper.client).publish({
                    orderId: order.id,
                    orderStatus: order.orderStatus.name,
                    buyerName: buyer.name
                })
            }
        }
    }
}