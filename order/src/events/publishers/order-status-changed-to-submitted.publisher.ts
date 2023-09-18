import { Listener, OrderStatusChangedToSubmittedEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class OrderStatusChangedToSubmittedPublisher extends Publisher<OrderStatusChangedToSubmittedEvent>{
    subject: Subjects.OrderStatusChangedToSubmitted = Subjects.OrderStatusChangedToSubmitted;
}