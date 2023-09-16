import { Subjects } from "./subjects";

export interface OrderStatusChangedToShippedEvent {
    subject: Subjects.OrderStatusChangedToShipped,
    data: {
        orderId: string;
        orderStatus: string;
        buyerName: string;
    }
}