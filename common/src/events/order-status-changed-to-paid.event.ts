import { Subjects } from "./subjects"

export interface OrderStockChangedToPaid {
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