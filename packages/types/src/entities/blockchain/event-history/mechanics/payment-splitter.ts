export enum PaymentSplitterEventType {
  PayeeAdded = "PayeeAdded",
  PaymentReleased = "PaymentReleased",
  ERC20PaymentReleased = "ERC20PaymentReleased",
  PaymentReceived = "PaymentReceived",
}

export enum PaymentSplitterEventSignature {
  PayeeAdded = "PayeeAdded(address,uint256)",
  PaymentReleased = "PaymentReleased(address,uint256)",
  ERC20PaymentReleased = "ERC20PaymentReleased(address,address,uint256)",
  PaymentReceived = "PaymentReceived(address,uint256)",
}

export interface IPaymentSplitterPayeeAddedEvent {
  account: string;
  shares: bigint;
}

export interface IPaymentSplitterPaymentReleasedEvent {
  to: string;
  amount: bigint;
}

export interface IPaymentSplitterERC20PaymentReleasedEvent {
  token: string;
  to: string;
  amount: bigint;
}

export interface IPaymentSplitterPaymentReceivedEvent {
  from: string;
  amount: bigint;
}

export type TPaymentSplitterEvents =
  | IPaymentSplitterPayeeAddedEvent
  | IPaymentSplitterPaymentReleasedEvent
  | IPaymentSplitterERC20PaymentReleasedEvent
  | IPaymentSplitterPaymentReceivedEvent;
