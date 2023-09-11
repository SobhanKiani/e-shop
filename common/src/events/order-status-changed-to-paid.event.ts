import { Subjects } from "./subjects"

export interface OrderStockChangedToPaidEvent {
    subject: Subjects.OrderStatusChangedToPaid;
    data: {
        orderId: string,
        version: number;
        orderStockItems: {
            productId: string,
            units: number,
        }[];
    }
}