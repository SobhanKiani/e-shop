import { OrderPaymentSucceededEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class OrderPaymentSucceededPublisher extends Publisher<OrderPaymentSucceededEvent>{
    subject: Subjects.OrderPaymentSucceeded = Subjects.OrderPaymentSucceeded;
}