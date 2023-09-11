import { Listener, OrderStatusChangedToAwaitingValidationEvent, Subjects } from "@sobhankiani/e-shop-common";
import { Message } from "node-nats-streaming";
import { CatalogItem } from "../../models/CatalogItem";
import { OrderStockConfirmedPublisher } from "../publishers/OrderStockConfirmed";
import { natsWrapper } from "../../nats-wrapper";
import { OrderStockRejectedPublisher } from "../publishers/OrderStockRejected";

export class OrderStatusChangedToAwaitingValidationListener extends Listener<OrderStatusChangedToAwaitingValidationEvent>{
    subject: Subjects.OrderStatusChangedToAwaitingValidation = Subjects.OrderStatusChangedToAwaitingValidation;
    queueGroupName: string = this.queueGroupName;

    async onMessage(data: OrderStatusChangedToAwaitingValidationEvent['data'], msg: Message) {
        const { orderStockItems, version, orderId } = data
        const confirmedOrderStockItems: Array<{ productId: string, hasStock: boolean, version: number }> = [];

        for (let stockItem of orderStockItems) {
            const item = await CatalogItem.findOne({ id: stockItem.productId });

            if (!item) {
                confirmedOrderStockItems.push({ productId: stockItem.productId, hasStock: false, version: stockItem.version })
            } else {
                const hasStock = item.availableStock >= stockItem.units;
                confirmedOrderStockItems.push({ productId: stockItem.productId, hasStock, version: stockItem.version })
            }
        }
        const confirmed = confirmedOrderStockItems.every((item) => item.hasStock == true);
        if (confirmed) {
            new OrderStockConfirmedPublisher(natsWrapper.client).publish({ orderId, version });
        } else {
            new OrderStockRejectedPublisher(natsWrapper.client).publish(confirmedOrderStockItems)
        }

        msg.ack();
    }
}