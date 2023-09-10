import { Publisher, Subjects, UserCheckoutAcceptedEvent } from "@sobhankiani/e-shop-common";

export class UserCheckoutAcceptedPublisher extends Publisher<UserCheckoutAcceptedEvent>{
    subject: Subjects.UserCheckoutAccepted = Subjects.UserCheckoutAccepted;
}