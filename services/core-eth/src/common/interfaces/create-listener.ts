export interface ICreateListenerPayload {
  address: Array<string>;
  fromBlock: number;
}

export interface IContractListenerResult {
  address: Array<string> | null;
  fromBlock?: number;
}
