export enum MysteryEventType {
  UnpackMysteryBox = "UnpackMysteryBox",
}

export enum MysteryEventSignature {
  UnpackMysteryBox = "UnpackMysteryBox",
}

export interface IUnpackMysteryBoxEvent {
  account: string;
  tokenId: bigint;
}

export type TMysteryEvents = IUnpackMysteryBoxEvent;
