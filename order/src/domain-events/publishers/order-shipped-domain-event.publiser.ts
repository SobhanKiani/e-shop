import { OrderDomainEventSubjects, OrderShippedDomainEvent, Publisher } from "@sobhankiani/e-shop-common";

export class OrderShippedDomainEventPublisher extends Publisher<OrderShippedDomainEvent>{
    subject: OrderDomainEventSubjects.OrderCancelledDomainEvent = OrderDomainEventSubjects.OrderCancelledDomainEvent;
}