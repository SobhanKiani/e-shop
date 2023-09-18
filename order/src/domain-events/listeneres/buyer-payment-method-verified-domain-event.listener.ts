import { BuyerPaymentMethodVerifiedDomainEvent, Listener, OrderDomainEventSubjects, Publisher } from "@sobhankiani/e-shop-common";
import { Message } from "node-nats-streaming";
import { queueGroupNameDomainEvents } from "./queueGroupName";
import { Order } from "../../models/order-aggregat/order";

export class BuyerPaymentMethodVerifiedDomainEventListener extends Listener<BuyerPaymentMethodVerifiedDomainEvent>{
    subject: OrderDomainEventSubjects.BuyerPaymentMethodVerifiedDomainEvent = OrderDomainEventSubjects.BuyerPaymentMethodVerifiedDomainEvent;
    queueGroupName: string = queueGroupNameDomainEvents;

    async onMessage(data: BuyerPaymentMethodVerifiedDomainEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (order) {
            order.buyerId = data.buyer.id;
            order.paymentMethodId = data.paymentMethod?.id
            await order.save();
        }

    }
}