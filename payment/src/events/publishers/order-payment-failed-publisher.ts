import { OrderPaymentFailedEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class OrderPaymentFailePublisher extends Publisher<OrderPaymentFailedEvent>{
    subject: Subjects.OrderPaymentFailed = Subjects.OrderPaymentFailed;
}