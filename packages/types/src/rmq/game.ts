export enum GameEventType {
  DUMMY = "DUMMY",
}

export interface IMessage {
  from: string;
  to: string;
  value: string;
  transactionHash: string;
}
