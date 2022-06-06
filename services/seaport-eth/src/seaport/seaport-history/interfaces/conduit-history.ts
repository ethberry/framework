import { IIdDateBase } from "@gemunion/types-collection";

export enum ConduitEventType {
  ChannelUpdated = "ChannelUpdated",
}

export interface IConduitChannelUpdated {
  conduit: string;
  conduitKey: string;
}

export type TConduitEventData = IConduitChannelUpdated;

export interface IConduitHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ConduitEventType;
  eventData: TConduitEventData;
}
