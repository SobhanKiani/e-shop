import { OrderStatusChangedToPaidEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class OrderStatusChangedToPaidPublisher extends Publisher<OrderStatusChangedToPaidEvent>{
    subject: Subjects.OrderStatusChangedToPaid = Subjects.OrderStatusChangedToPaid;
}