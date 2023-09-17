import { Subjects } from "./subjects"

export interface OrderStatusChangedToPaidEvent {
    subject: Subjects.OrderStatusChangedToPaid;
    data: {
        orderId: string;
        version: number;
        buyerName: string;
        orderStockItems: {
            productId: string;
            units: number;
            version: number;
        }[];
    }
}