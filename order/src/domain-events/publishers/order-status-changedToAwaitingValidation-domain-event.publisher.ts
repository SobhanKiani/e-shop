import { OrderDomainEventSubjects, OrderStatusChangedToAwaitingValidationDomainEvent, Publisher } from "@sobhankiani/e-shop-common";

export class OrderStatusChangedToAwaitingValidationDomainEventPublisher extends Publisher<OrderStatusChangedToAwaitingValidationDomainEvent>{
    subject: OrderDomainEventSubjects.OrderStatusChangedToAwaitingValidationDomainEvent = OrderDomainEventSubjects.OrderStatusChangedToAwaitingValidationDomainEvent;
}