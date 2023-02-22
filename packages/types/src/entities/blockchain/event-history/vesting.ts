export enum VestingEventType {
  EtherReleased = "EtherReleased",
  ERC20Released = "ERC20Released",
  PaymentEthReceived = "PaymentEthReceived",
  // Erc1363EventType-TransferReceived
}

export interface IVestingEtherReleasedEvent {
  amount: string;
}

export interface IVestingERC20ReleasedEvent {
  token: string;
  amount: string;
}

export interface IVestingEtherReceivedEvent {
  from: string;
  amount: string;
}

export type TVestingEvents = IVestingEtherReleasedEvent | IVestingERC20ReleasedEvent | IVestingEtherReceivedEvent;
