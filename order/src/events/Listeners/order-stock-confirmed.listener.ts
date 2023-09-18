import { Listener, OrderStockConfirmedEvent, Subjects } from "@sobhankiani/e-shop-common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-aggregat/order";

export class OrderStockConfirmedListener extends Listener<OrderStockConfirmedEvent>{
    subject: Subjects.OrderStockConfirmed = Subjects.OrderStockConfirmed;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderStockConfirmedEvent['data'], msg: Message) {

        setTimeout(() => {
            console.log("Simulating the Confiramtion Task")
        }, 10 * 1000)

        const order = await Order.findOne({ id: data.orderId, version: data.version });
        if (order) {
            order.setStockConfirmedStatus();
        }
    }
}