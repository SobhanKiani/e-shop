import { Listener, Subjects, UserCheckoutAcceptedEvent } from "@sobhankiani/e-shop-common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Address } from "../../models/order-aggregat/address";
import { Order } from "../../models/order-aggregat/order";
import { OrderStartedDomainEventPublisher } from "../../domain-events/publishers/order-started-domain-event.publisher";
import { natsWrapper } from "../../nats-wrapper";

export class UserCheckoutAcceptedListener extends Listener<UserCheckoutAcceptedEvent>{
    subject: Subjects.UserCheckoutAccepted = Subjects.UserCheckoutAccepted;
    queueGroupName: string = queueGroupName;

    async onMessage(data: UserCheckoutAcceptedEvent['data'], msg: Message) {

        const address = Address.build({
            city: data.city,
            country: data.country,
            state: data.state,
            street: data.street,
            zipCode: data.zipCode
        });
        await address.save();

        const order = Order.build({
            address: address,
            buyerId: data.buyer,
            date: new Date(),
            description: 'order created.',
            isDraft: false,
        });

        await order.save();

        for (const orderItem of data.basket.orderItems) {
            order.addOrderItem(
                orderItem.productId,
                orderItem.productName,
                orderItem.unitPrice,
                orderItem.discount,
                orderItem.units
            )
        }
        
        new OrderStartedDomainEventPublisher(natsWrapper.client).publish({
            userId: data.userId,
            userName: data.userName,
            orderId: order.id,
            cardType: data.cardTypeId,
            cardSecurityNumber: data.cardSecurityNumber,
            cardNumber: data.cardNumber,
            cardHolderName: data.cardHolderName,
            cardExpiration: data.cardExpiration
        })
    }
}