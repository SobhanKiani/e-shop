import { OrderDomainEventSubjects } from "./order-domaine-event-subjects";

export interface OrderStatusChangedToAwaitingValidationDomainEvent {
    subject: OrderDomainEventSubjects.OrderStatusChangedToAwaitingValidationDomainEvent;
    data: {
        orderId: string;
        orderItems: any;
    }
}