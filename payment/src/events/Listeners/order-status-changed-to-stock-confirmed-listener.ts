import { Listener, OrderStatusChangedToStockConfirmedEvent, Subjects } from "@sobhankiani/e-shop-common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { OrderPaymentSucceededPublisher } from "../publishers/order-payment-succeeded-publisher";
import { natsWrapper } from "../../nats-wrapper";
import { OrderPaymentFailePublisher } from "../publishers/order-payment-failed-publisher";

export class OrderStatusChangedToStockConfirmedListener extends Listener<OrderStatusChangedToStockConfirmedEvent>{
    subject: Subjects.OrderStatusChangedToStockConfirmed = Subjects.OrderStatusChangedToStockConfirmed;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderStatusChangedToStockConfirmedEvent['data'], msg: Message) {
        if (process.env.PAYMENT_SUCCEEDED) {
            new OrderPaymentSucceededPublisher(natsWrapper.client).publish(data);
        } else {
            new OrderPaymentFailePublisher(natsWrapper.client).publish(data);
        }

        msg.ack()
    }
}