export interface IVrfRandomnessRequestEvent {
  sender: string;
  keyHash: string;
  seed: string;
}

export interface IVrfRandomRequestEvent {
  _requestID: string;
  _sender: string;
}

export interface IVrfRandomWordsRequestedEvent {
  keyHash: string;
  requestId: string;
  preSeed: string;
  subId: string;
  minimumRequestConfirmations: string;
  callbackGasLimit: string;
  numWords: string;
  sender: string;
}

// event SubscriptionCreated(uint64 indexed subId, address owner);
export interface IVrfSubscriptionCreatedEvent {
  subId: string;
  owner: string;
}

// event VrfSubscriptionSet(uint64 subId);
export interface IVrfSubscriptionSetEvent {
  subId: string;
}

// event SubscriptionConsumerAdded(uint64 indexed subId, address consumer);
export interface IVrfSubscriptionConsumerAddedEvent {
  subId: string;
  consumer: string;
}

export type TChainLinkEvents =
  | IVrfRandomnessRequestEvent
  | IVrfRandomRequestEvent
  | IVrfRandomWordsRequestedEvent
  | IVrfSubscriptionCreatedEvent
  | IVrfSubscriptionSetEvent
  | IVrfSubscriptionConsumerAddedEvent;
