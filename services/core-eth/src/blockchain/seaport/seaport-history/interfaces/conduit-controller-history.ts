import { IIdBase } from "@gemunion/types-collection";

export enum ConduitControllerEventType {
  NewConduit = "NewConduit",
  OwnershipTransferred = "OwnershipTransferred",
  PotentialOwnerUpdated = "PotentialOwnerUpdated",
}

export interface IConduitControllerNewConduit {
  conduit: string;
  conduitKey: string;
}

export interface IConduitControllerOwnershipTransferred {
  conduit: string;
  previousOwner: string;
  newOwner: string;
}

export interface IConduitControllerPotentialOwnerUpdated {
  conduit: string;
  newPotentialOwner: string;
}

export type TConduitControllerEventData =
  | IConduitControllerNewConduit
  | IConduitControllerOwnershipTransferred
  | IConduitControllerPotentialOwnerUpdated;

export interface IConduitControllerHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: ConduitControllerEventType;
  eventData: TConduitControllerEventData;
}
