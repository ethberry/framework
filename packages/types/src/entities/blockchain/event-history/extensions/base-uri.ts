export enum BaseUrlEventType {
  BaseURIUpdate = "BaseURIUpdate",
}

export enum BaseUrlEventSignature {
  BaseURIUpdate = "BaseURIUpdate(string)",
}

export interface IBaseURIUpdateEvent {
  baseTokenURI: string;
}

export type TBaseURIEvents = IBaseURIUpdateEvent;
