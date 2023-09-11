import { OrderStockRejectedEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class OrderStockRejectedPublisher extends Publisher<OrderStockRejectedEvent>{
    subject: Subjects.OrderStockRejected = Subjects.OrderStockRejected;
}