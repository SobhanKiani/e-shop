export enum OrderDomainEventSubjects {
    OrderCancelledDomainEvent = 'OrderCancelledDomainEvent',
    OrderShippedDomainEvent = 'OrderCancelledDomainEvent',
    OrderStatusChangedToAwaitingValidationDomainEvent = 'OrderStatusChangedToAwaitingValidationDomainEvent',
    OrderStatusChangedToPaidDomainEvent = "OrderStatusChangedToPaidDomainEvent",
    OrderStatusChangedToStockConfirmedDomainEvent = 'OrderStatusChangedToStockConfirmedDomainEvent',
    BuyerPaymentMethodVerifiedDomainEvent = 'BuyerPaymentMethodVerifiedDomainEvent',
    OrderStartedDomainEvent = 'OrderStartedDomainEvent',
}
