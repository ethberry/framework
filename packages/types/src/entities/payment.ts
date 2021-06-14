import {IUser} from "./user";
import {IBase} from "./base";

export enum PaymentSource {
  LIQPAY = "LIQPAY",
}

export enum PaymentCurrency {
  UAH = "UAH",
}

export interface IPayment extends IBase {
  amount: number;
  currency: PaymentCurrency;
  source: PaymentSource;
  receipt: string;
  userId: number;
  user?: IUser;
}
