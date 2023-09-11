import { Subjects } from "./subjects";

export interface OrderStockConfirmedEvent {
    subject: Subjects.OrderStockConfirmed;
    data: {
        orderId: string;
        version:number;
    };
}