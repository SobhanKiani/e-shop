import { Listener, OrderStockRejectedEvent, Subjects } from "@sobhankiani/e-shop-common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-aggregat/order";

export class OrderStockRejectedListener extends Listener<OrderStockRejectedEvent>{
    subject: Subjects.OrderStockRejected = Subjects.OrderStockRejected;
    queueGroupName: string = queueGroupName
    async onMessage(data: OrderStockRejectedEvent['data'], msg: Message) {
        setTimeout(() => {
            console.log("Simulating Confirmation Task...", 10 * 1000)
        })

        const order = await Order.findOne({ id: data.orderId, version: data.version });
        if (order) {
            const rejectedItemIds = data.orderStockItems.map((oi) => oi.productId);
            const rejectedItems = order.orderItems.map((oi) => rejectedItemIds.includes(oi.productId));
            order.setCancelledStatusWhenOrderIsRejected(rejectedItems)
        }

    }
}