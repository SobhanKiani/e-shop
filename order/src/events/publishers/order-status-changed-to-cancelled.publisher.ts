import { OrderCancelledDomainEvent, OrderDomainEventSubjects, OrderStatusChangedToCancelledEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class OrderStatusChangedToCancelledPublisher extends Publisher<OrderStatusChangedToCancelledEvent>{
    subject: Subjects.OrderStatusChangedToCancelled = Subjects.OrderStatusChangedToCancelled;
}