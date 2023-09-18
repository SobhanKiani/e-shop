import { BuyerPaymentMethodVerifiedDomainEvent, OrderDomainEventSubjects, Publisher } from "@sobhankiani/e-shop-common";

export class BuyerPaymentMethodVerifiedDomainEventPublisher extends Publisher<BuyerPaymentMethodVerifiedDomainEvent>{
    subject: OrderDomainEventSubjects.BuyerPaymentMethodVerifiedDomainEvent = OrderDomainEventSubjects.BuyerPaymentMethodVerifiedDomainEvent;
}