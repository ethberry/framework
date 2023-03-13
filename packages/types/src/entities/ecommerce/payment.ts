import type { IIdDateBase } from "@gemunion/types-collection";

import { IUser } from "../infrastructure";

export enum PaymentSource {
  LIQPAY = "LIQPAY",
  STRIPE = "STRIPE",
  PAYPAL = "PAYPAL",
}
export enum PaymentCurrency {
  UAH = "UAH",
  RUB = "RUB",
  USD = "USD",
}

export interface IPayment extends IIdDateBase {
  amount: number;
  paymentSource: PaymentSource;
  paymentCurrency: PaymentCurrency;
  ref: string;
  userId: number;
  user?: IUser;
}
