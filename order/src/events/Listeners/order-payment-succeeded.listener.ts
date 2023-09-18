import { Listener, OrderPaymentSucceededEvent, Subjects } from "@sobhankiani/e-shop-common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-aggregat/order";

export class OrderPaymentSucceededListener extends Listener<OrderPaymentSucceededEvent>{
    subject: Subjects.OrderPaymentSucceeded = Subjects.OrderPaymentSucceeded;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderPaymentSucceededEvent['data'], msg: Message) {
        const order = await Order.findOne({ id: data.orderId, version: data.version - 1 })
        if (order) {
            order.setPaidStatus();
        }
    }
}