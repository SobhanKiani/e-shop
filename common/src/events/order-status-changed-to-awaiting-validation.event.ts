import { Subjects } from "./subjects";

export interface OrderStatusChangedToAwaitingValidationEvent {
    subject: Subjects.OrderStatusChangedToAwaitingValidation;
    data: {
        orderId: string;
        version: number;
        orderStockItems: {
            productId: string;
            units: number;
            version: number;
        }[];
    }
}