export enum LootEventType {
  UnpackLootBox = "UnpackLootBox",
}

export enum LootEventSignature {
  UnpackLootBox = "UnpackLootBox(address,uint256)",
}

export interface IUnpackLootBoxEvent {
  account: string;
  tokenId: bigint;
}

export type TLootEvents = IUnpackLootBoxEvent;
