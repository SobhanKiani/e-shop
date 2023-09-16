import { OrderDomainEventSubjects } from "./order-domaine-event-subjects";

export interface OrderStatusChangedToPaidDomainEvent {
    subject: OrderDomainEventSubjects.OrderStatusChangedToPaidDomainEvent
    data: {
        orderId: string;
        orderItems: any;
    }
}