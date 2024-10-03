export enum Erc1363EventType {
  TransferReceived = "TransferReceived",
}

export enum Erc1363EventSignature {
  TransferReceived = "TransferReceived(address,address,uint256,bytes)",
}

export interface IErc1363TransferReceivedEvent {
  operator: string;
  from: string;
  value: string;
  data: string;
}

export type TErc1363Events = IErc1363TransferReceivedEvent;
