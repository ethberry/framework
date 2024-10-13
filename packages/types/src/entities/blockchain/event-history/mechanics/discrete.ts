export enum DiscreteEventType {
  LevelUp = "LevelUp",
}

export enum DiscreteEventSignature {
  LevelUp = "LevelUp(address,uint256,bytes32,uint256)",
}

export interface ILevelUp {
  account: string;
  tokenId: bigint;
  attribute: string;
  value: string;
}

// OPENSEA ERC4906
export interface IMetadataUpdate {
  _tokenId: string;
}

export interface IBatchMetadataUpdate {
  _fromTokenId: string;
  _toTokenId: string;
}

export type TDiscreteEvents = ILevelUp | IMetadataUpdate | IBatchMetadataUpdate;
