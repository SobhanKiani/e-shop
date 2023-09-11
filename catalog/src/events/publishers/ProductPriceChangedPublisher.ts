import { ProductPriceChangedEvent, Publisher, Subjects } from "@sobhankiani/e-shop-common";

export class ProductPriceChangedPublisher extends Publisher<ProductPriceChangedEvent> {
    subject: Subjects.ProdcutPriceChanged = Subjects.ProdcutPriceChanged;
}