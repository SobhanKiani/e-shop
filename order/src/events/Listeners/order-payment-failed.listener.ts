import { Listener, OrderPaymentFailedEvent, Subjects } from "@sobhankiani/e-shop-common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-aggregat/order";

export class OrderPaymentFailedEventListener extends Listener<OrderPaymentFailedEvent>{
    subject: Subjects.OrderPaymentFailed = Subjects.OrderPaymentFailed;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderPaymentFailedEvent['data'], msg: Message) {
        const order = await Order.findOne({ id: data.orderId, version: data.version - 1 });
        if (order) {
            order.setCancelledStatus()
        }

    }
}