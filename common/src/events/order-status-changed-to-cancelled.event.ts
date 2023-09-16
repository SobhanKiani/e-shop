import { Subjects } from "./subjects";

export interface OrderStatusChangedToCancelledEvent {
    subject: Subjects.OrderStatusChangedToCancelled,
    data: {
        orderId: string;
        orderStatus: string;
        buyerName: string;
    }
}