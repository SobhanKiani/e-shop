import { OrderDomainEventSubjects, OrderStartedDomainEvent, Publisher } from "@sobhankiani/e-shop-common";

export class OrderStartedDomainEventPublisher extends Publisher<OrderStartedDomainEvent>{
    subject: OrderDomainEventSubjects.OrderStartedDomainEvent = OrderDomainEventSubjects.OrderStartedDomainEvent;
}