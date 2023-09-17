import { Subjects } from "./subjects";

export interface OrderStatusChangedToSubmittedEvent {
    subject: Subjects.OrderStatusChangedToSubmitted;
    data: {
        orderId: string;
        orderStatus: string;
        buyerName: string;
    }
}