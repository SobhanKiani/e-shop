import { Subjects } from "./subjects";

export interface OrderStockConfirmed {
    subject: Subjects.OrderStockConfirmed;
    data: {
        orderId: string;
        version:number;
    };
}