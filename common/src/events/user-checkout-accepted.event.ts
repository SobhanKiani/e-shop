import { Subjects } from "./subjects";

export interface UserCheckoutAcceptedEvent {
    subject: Subjects.UserCheckoutAccepted,
    data: {
        userId: string;
        userName: string;
        city: string;
        street: string;
        state: string;
        country: string;
        zipCode: string;
        cardNumber: string;
        cardHolderName: string;
        cardExpiration: Date;
        cardSecurityNumber: string;
        cardTypeId: string;
        buyer: string;
        basket: {
            buyerId: string;
            orderItems: {
                productName: string;
                productId: string;
                units: number;
                unitPrice: number;
                discount: number;
            }[]
            version: number
        };
        requestId: string;
        version: number;
    }
}
