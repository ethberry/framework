export enum ChainLinkType {
  VRF = "VRF",
}

export enum ChainLinkEventType {
  RandomWordsRequested = "RandomWordsRequested",
}

// event RandomWordsRequested(bytes32 indexed keyHash,uint256 requestId,uint256 preSeed,uint64 indexed subId,uint16 minimumRequestConfirmations,uint32 callbackGasLimit,uint32 numWords,address indexed sender);
export enum ChainLinkEventSignatures {
  RandomWordsRequested = "RandomWordsRequested(bytes32,uint256,uint256,uint64,uint16,uint32,uint32,address)",
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
  sender: string;
}
