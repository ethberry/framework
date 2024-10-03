export enum Erc20EventType {
  Approval = "Approval",
  Transfer = "Transfer",
}

export enum Erc20EventSignature {
  Approval = "Approval(address,address,uint256)",
  Transfer = "Transfer(address,address,uint256)",
}

export interface IErc20TokenTransferEvent {
  from: string;
  to: string;
  value: string;
}

export interface IErc20TokenApproveEvent {
  owner: string;
  spender: string;
  value: string;
}

export type TErc20Events = IErc20TokenTransferEvent | IErc20TokenApproveEvent;
