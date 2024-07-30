export enum ChainLinkType {
  VRF = "VRF",
  VRF_SUB = "VRF_SUB",
}

export enum ChainLinkEventType {
  RandomWordsRequested = "RandomWordsRequested",
  SubscriptionCreated = "SubscriptionCreated",
  SubscriptionConsumerAdded = "SubscriptionConsumerAdded",
}

export enum ChainLinkEventSignatures {
  RandomWordsRequested = "RandomWordsRequested(bytes32,uint256,uint256,uint256,uint16,uint32,uint32,bytes,address)",
  SubscriptionCreated = "SubscriptionCreated(uint64,address)",
  SubscriptionConsumerAdded = "SubscriptionConsumerAdded(uint64,address)",
}

// event RandomnessRequestId(bytes32 _requestID, address indexed _sender);
export interface IChainLinkRandomRequestEvent {
  _requestID: string;
  _sender: string;
}

export interface IChainLinkRandomWordsRequestedEvent {
  keyHash: string;
  requestId: string;
  preSeed: string;
  subId: string;
  minimumRequestConfirmations: string;
  callbackGasLimit: string;
  numWords: string;
  extraArgs: string;
  sender: string;
}
