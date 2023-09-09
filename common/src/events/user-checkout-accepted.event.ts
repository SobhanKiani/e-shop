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
        cardTypeId: number;
        buyer: string;
        basket: string;
        requestId: string;
    }
}
