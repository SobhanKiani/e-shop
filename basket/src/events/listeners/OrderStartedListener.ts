import { Listener, OrderStartedEvent, Subjects } from "@sobhankiani/e-shop-common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { CustomerBasket } from "../../models/customer-basket";

export class OrderStartedListener extends Listener<OrderStartedEvent>{
    subject: Subjects.OrderStarted = Subjects.OrderStarted
    queueGroupName: string = queueGroupName

    async onMessage(data: OrderStartedEvent['data'], msg: Message) {
        const { userId } = data
        await CustomerBasket.findOneAndDelete({ buyerId: userId });

        msg.ack();
    }
}