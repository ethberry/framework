export enum WrapperEventType {
  UnpackWrapper = "UnpackWrapper",
}

export enum WrapperEventSignature {
  UnpackWrapper = "UnpackWrapper(address,uint256)",
}

export interface IUnpackWrapper {
  account: string;
  tokenId: string;
}

export type TWrapperEvents = IUnpackWrapper;
