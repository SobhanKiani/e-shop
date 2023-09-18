import { OrderDomainEventSubjects, OrderStatusChangedToAwaitingValidationDomainEvent, Listener } from "@sobhankiani/e-shop-common";
import { queueGroupNameDomainEvents } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-aggregat/order";
import { Buyer } from "../../models/buyer-aggregate/buyer";
import { OrderStatusChangedToAwaitingValidationDomainEventPublisher } from "../publishers/order-status-changedToAwaitingValidation-domain-event.publisher";
import { natsWrapper } from "../../nats-wrapper";
import { OrderStatusChangedToAwaitingValidationPublisher } from "../../events/publishers/order-status-changed-to-awaiting-validation.publihser";

export class OrderStatusChangedToAwaitingValidationDomainEventListener extends Listener<OrderStatusChangedToAwaitingValidationDomainEvent>{
    subject: OrderDomainEventSubjects.OrderStatusChangedToAwaitingValidationDomainEvent = OrderDomainEventSubjects.OrderStatusChangedToAwaitingValidationDomainEvent;
    queueGroupName: string = queueGroupNameDomainEvents;

    async onMessage(data: { orderId: string; orderItems: any; }, msg: Message) {
        const order = await Order.findById(data.orderId);
        const buyer = await Buyer.findOne({ userId: order?.buyerId });

        if (order && buyer) {
            new OrderStatusChangedToAwaitingValidationPublisher(natsWrapper.client).publish({
                orderId: order.id,
                orderStockItems: data.orderItems.map((oi) => {
                    return {
                        productId: oi.productId,
                        version: oi.version,
                        units: oi.units
                    }
                }),
                version: order.version
            })
        }

    }
}