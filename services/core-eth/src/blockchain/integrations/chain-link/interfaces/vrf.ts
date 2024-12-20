export enum ChainLinkType {
  VRF = "VRF",
  VRF_SUB = "VRF_SUB",
}

export enum ChainLinkEventType {
  RandomWordsRequested = "RandomWordsRequested",
  SubscriptionCreated = "SubscriptionCreated",
  SubscriptionConsumerAdded = "SubscriptionConsumerAdded",
}

// event RandomWordsRequested(bytes32 indexed keyHash,uint256 requestId,uint256 preSeed,uint64 indexed subId,uint16 minimumRequestConfirmations,uint32 callbackGasLimit,uint32 numWords,address indexed sender);

// V2PLUS
// event SubscriptionCreated(uint256 indexed subId, address owner);
// event SubscriptionConsumerAdded(uint256 indexed subId, address consumer);
export enum ChainLinkEventSignatures {
  RandomWordsRequested = "RandomWordsRequested(bytes32,uint256,uint256,uint256,uint16,uint32,uint32,bytes,address)",
  SubscriptionCreated = "SubscriptionCreated(uint64,address)",
  SubscriptionConsumerAdded = "SubscriptionConsumerAdded(uint256,address)",
}

// event RandomnessRequestId(bytes32 _requestID, address indexed _sender);
export interface IChainLinkRandomRequestEvent {
  _requestID: string;
  _sender: string;
}

// V2PLUS
// event RandomWordsRequested(
//   bytes32 indexed keyHash,
//   uint256 requestId,
//   uint256 preSeed,
//   uint256 indexed subId,
//   uint16 minimumRequestConfirmations,
//   uint32 callbackGasLimit,
//   uint32 numWords,
//   bytes extraArgs,
//   address indexed sender
// );

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
