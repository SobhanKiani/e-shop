import { OrderDomainEventSubjects } from "./order-domaine-event-subjects";

export interface BuyerPaymentMethodVerifiedDomainEvent {
    subject: OrderDomainEventSubjects.BuyerPaymentMethodVerifiedDomainEvent;
    data: {
        orderId: string;
        buyer: {
            name: string,
            version: number,
            id: string,
            paymentMethod?: any
        },
        paymentMethod: any
    }
}