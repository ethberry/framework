export interface ICreateListenerPayload {
  address: Array<string>;
  fromBlock: number;
  topics?: (string | string[] | null)[];
}

export interface IContractListenerResult {
  address: Array<string>;
  fromBlock?: number;
}

export interface ISystemContractListenerResult {
  address: Array<string>;
  fromBlock?: number;
}
