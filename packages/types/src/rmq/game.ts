export enum GameType {
  DUMMY = "DUMMY",
}

export interface IMessage {
  from: string;
  to: string;
  value: string;
  transactionHash: string;
}
