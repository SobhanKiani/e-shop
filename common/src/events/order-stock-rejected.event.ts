import { Subjects } from "./subjects";

export interface OrderStockRejected {
    subject: Subjects.OrderStockRejected;
    data: {
        productId: string;
        hasStock: boolean;
        version: number;
    }[]
}