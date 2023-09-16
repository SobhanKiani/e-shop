import { Subjects } from "./subjects";

export interface OrderStockRejectedEvent {
    subject: Subjects.OrderStockRejected;
    data: {
        orderStockItems: {
            productId: string;
            hasStock: boolean;
            version: number;
        }[],
        orderId: string;
        version: number;c
    }
}