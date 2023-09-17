import { Subjects } from "./subjects";

export interface OrderStatusChangedToSubmiitedEvent {
    subject:Subjects.OrderStatusChangedToSubmiited;
    data:{
        orderId:string;
        orderStatus:string;
        buyerName:string;
    }
}