export enum MysteryEventType {
  UnpackMysteryBox = "UnpackMysteryBox",
}

export enum MysteryEventSignature {
  UnpackMysteryBox = "UnpackMysteryBox",
}

export interface IUnpackMysteryBoxEvent {
  account: string;
  tokenId: string;
}

export type TMysteryEvents = IUnpackMysteryBoxEvent;
