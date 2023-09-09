import { Subjects } from "./subjects";

export interface ProductPriceChangedEvent {
    subject: Subjects.ProdcutPriceChanged
    data: {
        productId: string;
        newPrice: number;
        oldPrice: number;
    }
}