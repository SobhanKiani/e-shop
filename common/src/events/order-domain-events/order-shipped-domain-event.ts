import { OrderDomainEventSubjects } from "./order-domaine-event-subjects";

export interface OrderShippedDomainEvent {
    subject: OrderDomainEventSubjects.OrderShippedDomainEvent;
    data: {
        orderId: string;
    }
}