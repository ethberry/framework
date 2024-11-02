export enum LegacyVestingEventType {
  EtherReleased = "EtherReleased",
  ERC20Released = "ERC20Released",
  PaymentReceived = "PaymentReceived",
  TransferReceived = "TransferReceived",
}

export enum LegacyVestingEventSignature {
  EtherReleased = "EtherReleased(uint256)",
  ERC20Released = "ERC20Released(address,uint256)",
  PaymentReceived = "PaymentReceived(address,uint256)",
  TransferReceived = "TransferReceived(address,address,uint256,bytes)",
}

export interface ILegacyVestingEtherReleasedEvent {
  amount: string;
}

export interface ILegacyVestingERC20ReleasedEvent {
  token: string;
  amount: string;
}

export interface ILegacyVestingPaymentReceivedEvent {
  from: string;
  amount: string;
}

export interface ILegacyVestingTransferReceivedEvent {
  operator: string;
  from: string;
  value: string;
  data: string;
}

export type TLegacyVestingEvents =
  | ILegacyVestingEtherReleasedEvent
  | ILegacyVestingERC20ReleasedEvent
  | ILegacyVestingPaymentReceivedEvent
  | ILegacyVestingTransferReceivedEvent;
