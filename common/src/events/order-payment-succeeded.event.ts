import { Subjects } from "./subjects";

export interface OrderPaymentSucceededEvent {
    subject: Subjects.OrderPaymentSucceeded;
    data: {
        orderId: string;
        number: number;
    }
}