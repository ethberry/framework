export interface ICreateListenerPayload {
  address: string;
  fromBlock: number;
}

export interface IContractListenerResult {
  address: Array<string> | null;
  fromBlock?: number;
}
