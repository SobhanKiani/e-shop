import { OrderDomainEventSubjects } from "./order-domaine-event-subjects";

export interface OrderCancelledDomainEvent {
    subject: OrderDomainEventSubjects.OrderCancelledDomainEvent;
    data: {
        orderId: string;
    }
}