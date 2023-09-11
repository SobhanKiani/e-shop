import { Listener, OrderStatusChangedToPaidEvent, Subjects } from "@sobhankiani/e-shop-common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { CatalogItem } from "../../models/CatalogItem";

export class OrderStatusChangedToPaidListener extends Listener<OrderStatusChangedToPaidEvent>{
    subject: Subjects.OrderStatusChangedToPaid = Subjects.OrderStatusChangedToPaid;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderStatusChangedToPaidEvent['data'], msg: Message) {
        const { orderId, orderStockItems, version } = data;

        for (let stockItem of orderStockItems) {
            const item = await CatalogItem.findOne({ id: stockItem.productId, version: stockItem.version - 1 })
            if (item) {
                item.availableStock = item.availableStock - stockItem.units;
                await item.save();
            }
        }

        msg.ack();
    }
}