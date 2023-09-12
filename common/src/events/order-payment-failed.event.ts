import { Subjects } from "./subjects";

export interface OrderPaymentFailedEvent {
    subject: Subjects.OrderPaymentFailed;
    data: {
        orderId: string;
        version: number;
    }
}