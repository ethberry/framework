export enum VestingEventType {
  EtherReleased = "EtherReleased",
  ERC20Released = "ERC20Released",
  PaymentReceived = "PaymentReceived",
  TransferReceived = "TransferReceived",
}

export enum VestingEventSignature {
  EtherReleased = "EtherReleased(uint256)",
  ERC20Released = "ERC20Released(address,uint256)",
  PaymentReceived = "PaymentReceived(address,uint256)",
  TransferReceived = "TransferReceived(address,address,uint256,bytes)",
}

export interface IVestingEtherReleasedEvent {
  amount: string;
}

export interface IVestingERC20ReleasedEvent {
  token: string;
  amount: string;
}

export interface IVestingPaymentReceivedEvent {
  from: string;
  amount: string;
}

export interface IVestingTransferReceivedEvent {
  operator: string;
  from: string;
  value: string;
  data: string;
}

export type TVestingEvents =
  | IVestingEtherReleasedEvent
  | IVestingERC20ReleasedEvent
  | IVestingPaymentReceivedEvent
  | IVestingTransferReceivedEvent;
