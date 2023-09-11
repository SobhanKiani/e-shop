import { OrderStockConfirmedEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class OrderStockConfirmedPublisher extends Publisher<OrderStockConfirmedEvent>{
    subject: Subjects.OrderStockConfirmed = Subjects.OrderStockConfirmed;

}