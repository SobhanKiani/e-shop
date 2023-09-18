import { Publisher, OrderStatusChangedToPaidDomainEvent, OrderDomainEventSubjects } from "@sobhankiani/e-shop-common";

export class OrderStatusChangedToPaidDomainEventPublisher extends Publisher<OrderStatusChangedToPaidDomainEvent>{
    subject: OrderDomainEventSubjects.OrderStatusChangedToPaidDomainEvent = OrderDomainEventSubjects.OrderStatusChangedToPaidDomainEvent;
}