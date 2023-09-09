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
        cardHolderNumber: string;
        cardExpiration: Date;
        cardSecurityNumber: string;
        cartTypeId: number;
        buyer: string;
        basket: string;
    }
}
