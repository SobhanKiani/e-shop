import { OrderCancelledDomainEvent, OrderDomainEventSubjects, Publisher } from "@sobhankiani/e-shop-common";

export class OrderCancelledDomainEventPublihser extends Publisher<OrderCancelledDomainEvent>{
    subject: OrderDomainEventSubjects.OrderCancelledDomainEvent = OrderDomainEventSubjects.OrderCancelledDomainEvent;
}