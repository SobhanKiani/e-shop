import { Subjects } from "./subjects";

export interface OrderStockRejectedEvent {
    subject: Subjects.OrderStockRejected;
    data: {
        productId: string;
        hasStock: boolean;
        version: number;
    }[]
}