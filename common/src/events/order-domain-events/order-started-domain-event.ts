import { OrderDomainEventSubjects } from "./order-domaine-event-subjects";

export interface OrderStartedDomainEvent {
    subject: OrderDomainEventSubjects.OrderStartedDomainEvent;
    data: {
        orderId: string,
        userName: string,
        userId: string,
        cardType: string,
        cardNumber: string,
        cardSecurityNumber: string,
        cardHolderName: string,
        cardExpiration: Date,
    }
}