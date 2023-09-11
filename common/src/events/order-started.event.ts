import { Subjects } from "./subjects";

export interface OrderStartedEvent {
    subject: Subjects.OrderStarted;
    data: {
        userId: string,
        version: number;
    };
}