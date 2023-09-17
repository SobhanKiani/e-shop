import { Subjects } from "./subjects";

export interface OrderStatusChangedToStockConfirmedEvent {
    subject: Subjects.OrderStatusChangedToStockConfirmed;
    data: {
        orderId: string;
        version: number;
        orderStatus: string;
        buyerName: string;
    }
}