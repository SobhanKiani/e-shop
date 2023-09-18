import { OrderStatusChangedToAwaitingValidationEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class OrderStatusChangedToAwaitingValidationPublisher extends Publisher<OrderStatusChangedToAwaitingValidationEvent>{
    subject: Subjects.OrderStatusChangedToAwaitingValidation = Subjects.OrderStatusChangedToAwaitingValidation;
}