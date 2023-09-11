import { Listener, ProductPriceChangedEvent, Subjects } from "@sobhankiani/e-shop-common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { CustomerBasket } from "../../models/customer-basket";

export class ProductPriceChangedListenter extends Listener<ProductPriceChangedEvent>{
    subject: Subjects.ProdcutPriceChanged = Subjects.ProdcutPriceChanged;
    queueGroupName: string = queueGroupName;

    async onMessage(data: ProductPriceChangedEvent['data'], msg: Message) {
        const { productId, oldPrice, newPrice, version } = data
        const basketsList = await CustomerBasket.find({ version: version - 1 }).populate('basketItems');

        for (let basket of basketsList) {
            const itemsToUpdate = basket.basketItems.filter((item) => { item.id == productId })

            for (let item of itemsToUpdate) {
                if (item.unitPrice == oldPrice) {
                    let originalPrice = item.unitPrice;
                    item.unitPrice = newPrice;
                    item.oldUnitPrice = originalPrice
                    await item.save()
                }
            }
        }

        msg.ack();
    }
}