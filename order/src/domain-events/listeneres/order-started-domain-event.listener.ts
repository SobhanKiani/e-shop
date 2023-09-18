import { OrderDomainEventSubjects, OrderStartedDomainEvent, Listener } from "@sobhankiani/e-shop-common";
import { queueGroupNameDomainEvents } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Buyer } from "../../models/buyer-aggregate/buyer";
import { OrderStatusChangedToShippedPublisher } from "../../events/publishers/order-status-changed-to-shipped.publisher";
import { natsWrapper } from "../../nats-wrapper";
import { Order } from "../../models/order-aggregat/order";
import { OrderStatusChangedToSubmittedPublisher } from "../../events/publishers/order-status-changed-to-submitted.publisher";

export class OrderStartedDomainEventListener extends Listener<OrderStartedDomainEvent>{
    subject: OrderDomainEventSubjects.OrderStartedDomainEvent = OrderDomainEventSubjects.OrderStartedDomainEvent;
    queueGroupName: string = queueGroupNameDomainEvents;

    async onMessage(data: { orderId: string; userName: string; userId: string; cardType: string; cardNumber: string; cardSecurityNumber: string; cardHolderName: string; cardExpiration: Date; }, msg: Message) {
        const cardTypeId = data.cardType
        let buyer = await Buyer.findOne({ userId: data.userId });
        const order = await Order.findById(data.orderId);

        if (order) {
            if (!buyer) {
                buyer = Buyer.build({
                    name: data.userName,
                    userId: data.userId
                })
                await buyer.save();
            }

            await buyer.verifyOrAddPaymentMethod({
                cardType: cardTypeId,
                cardHolderName: data.cardHolderName,
                cardNumber: data.cardNumber,
                expiration: data.cardExpiration,
                securityNumber: data.cardSecurityNumber,
                orderId: data.orderId
            });

            new OrderStatusChangedToSubmittedPublisher(natsWrapper.client).publish({
                orderId: data.orderId,
                orderStatus: order?.orderStatus.name,
                buyerName: buyer.name
            });
        }

    }
}