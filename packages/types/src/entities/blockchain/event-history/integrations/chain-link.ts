export enum ChainLinkEventType {
  // VRFCoordinatorV2_5
  RandomWordsRequested = "RandomWordsRequested",

  // SubscriptionAPI
  SubscriptionCreated = "SubscriptionCreated",
  SubscriptionConsumerAdded = "SubscriptionConsumerAdded",
  SubscriptionConsumerRemoved = "SubscriptionConsumerRemoved",

  // ChainLinkBaseV2Plus
  VrfSubscriptionSet = "VrfSubscriptionSet",
  MintRandom = "MintRandom",
  MintGenes = "MintGenes",
}

export enum ChainLinkEventSignature {
  // VRFCoordinatorV2_5
  RandomWordsRequested = "RandomWordsRequested(bytes32,uint256,uint256,uint256,uint16,uint32,uint32,bytes,address)",

  // SubscriptionAPI
  SubscriptionCreated = "SubscriptionCreated(uint256,address)",
  SubscriptionConsumerAdded = "SubscriptionConsumerAdded(uint256,address)",
  SubscriptionConsumerRemoved = "SubscriptionConsumerRemoved(uint256,address)",

  // ChainLinkBaseV2Plus
  VrfSubscriptionSet = "VrfSubscriptionSet(uint256)",
  MintRandom = "MintRandom(uint256,address,uint256[],uint256,uint256)",
  MintGenes = "MintGenes(uint256,address,uint256[],uint256,uint256)",
}

export interface IVrfRandomWordsRequestedEvent {
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

export interface IVrfSubscriptionCreatedEvent {
  subId: string;
  owner: string;
}

export interface IVrfSubscriptionConsumerAddedEvent {
  subId: string;
  consumer: string;
}

export interface IVrfSubscriptionConsumerRemovedEvent {
  subId: string;
  consumer: string;
}

export interface IVrfSubscriptionSetEvent {
  subId: string;
}

export interface IERC721TokenMintRandomEvent {
  requestId: string;
  to: string;
  randomWords: Array<string>;
  templateId: string;
  tokenId: bigint;
}

export interface IERC721TokenMintGenesEvent {
  requestId: string;
  to: string;
  randomWords: Array<string>;
  templateId: string;
  tokenId: string;
}

export type TChainLinkEvents =
  | IVrfRandomWordsRequestedEvent
  | IVrfSubscriptionCreatedEvent
  | IVrfSubscriptionConsumerAddedEvent
  | IVrfSubscriptionConsumerRemovedEvent
  | IVrfSubscriptionSetEvent
  | IERC721TokenMintRandomEvent;
