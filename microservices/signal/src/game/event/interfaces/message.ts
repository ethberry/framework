export enum SignalType {
  DISCOVERED = "DISCOVERED",
  PROCESSED = "PROCESSED",
}

export interface IMessageDto {
  sub: string;
  txHash: string;
  signalType: SignalType;
}
