import { OrderDomainEventSubjects } from "./order-domaine-event-subjects";

export interface OrderStatusChangedToStockConfirmedDomainEvent {
    subject: OrderDomainEventSubjects.OrderStatusChangedToStockConfirmedDomainEvent
    data: {
        orderId: string;
    }
}