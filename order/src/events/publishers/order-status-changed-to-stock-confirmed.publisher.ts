import { OrderStatusChangedToStockConfirmedEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class OrderStatusChangedToStockConfirmedPublisher extends Publisher<OrderStatusChangedToStockConfirmedEvent>{
    subject: Subjects.OrderStatusChangedToStockConfirmed = Subjects.OrderStatusChangedToStockConfirmed;
}