export enum ChainLinkType {
  VRF = "VRF",
}

export enum ChainLinkEventType {
  RandomnessRequestId = "RandomnessRequestId",
}

export enum ChainLinkEventSignatures {
  RandomnessRequestId = "RandomnessRequestId(bytes32,address)",
}

// event RandomnessRequestId(bytes32 _requestID, address indexed _sender);
export interface IChainLinkRandomRequestEvent {
  _requestID: string;
  _sender: string;
}
