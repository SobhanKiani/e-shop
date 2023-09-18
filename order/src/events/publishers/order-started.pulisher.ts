import { OrderStartedEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class OrderStartedPublisher extends Publisher<OrderStartedEvent>{
    subject: Subjects.OrderStarted = Subjects.OrderStarted;
}