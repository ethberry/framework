export interface ISignalMessageDto {
  account: string; // message receiver user.wallet
  transactionHash: string;
  transactionType?: string;
}
