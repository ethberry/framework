export enum Erc1363EventType {
  TransferReceived = "TransferReceived",
}

export interface IErc1363TransferReceivedEvent {
  operator: string;
  from: string;
  value: string;
  data: string;
}

export type TErc1363Events = IErc1363TransferReceivedEvent;
