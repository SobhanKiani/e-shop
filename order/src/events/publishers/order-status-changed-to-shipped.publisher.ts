import { OrderStatusChangedToShippedEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class OrderStatusChangedToShippedPublisher extends Publisher<OrderStatusChangedToShippedEvent>{
    subject: Subjects.OrderStatusChangedToShipped = Subjects.OrderStatusChangedToShipped;
}