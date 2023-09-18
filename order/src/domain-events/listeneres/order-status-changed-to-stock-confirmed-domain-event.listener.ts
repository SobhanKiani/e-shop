import { OrderDomainEventSubjects, OrderStatusChangedToStockConfirmedDomainEvent, Listener } from "@sobhankiani/e-shop-common";
import { queueGroupNameDomainEvents } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-aggregat/order";
import { Buyer } from "../../models/buyer-aggregate/buyer";
import { OrderStatusChangedToStockConfirmedPublisher } from "../../events/publishers/order-status-changed-to-stock-confirmed.publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderStatusChangedToStockConfirmedDomainEventListener extends Listener<OrderStatusChangedToStockConfirmedDomainEvent>{
    subject: OrderDomainEventSubjects.OrderStatusChangedToStockConfirmedDomainEvent = OrderDomainEventSubjects.OrderStatusChangedToStockConfirmedDomainEvent;
    queueGroupName: string = queueGroupNameDomainEvents;

    async onMessage(data: OrderStatusChangedToStockConfirmedDomainEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        const buyer = await Buyer.findOne({ userId: order?.buyerId });

        if (order && buyer) {
            new OrderStatusChangedToStockConfirmedPublisher(natsWrapper.client).publish({
                orderId: order.id,
                version: order.version,
                orderStatus: order.orderStatus.name,
                buyerName: buyer.name
            })
        }
    }

}