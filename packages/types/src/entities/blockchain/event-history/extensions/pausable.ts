export enum PausableEventType {
  Paused = "Paused",
  Unpaused = "Unpaused",
}

export enum PausableEventSignature {
  Paused = "Paused(address)",
  Unpaused = "Unpaused(address)",
}

export interface IPausedEvent {
  account: string;
}

export type TPausableEvents = IPausedEvent;
