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

export interface IVestingERC20ReleasedEvent {
  token: string;
  amount: string;
}

export type TVestingEvents = IVestingERC20ReleasedEvent;
