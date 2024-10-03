export enum DiscreteEventType {
  LevelUp = "LevelUp",
}

export enum DiscreteEventSignature {
  LevelUp = "LevelUp(address,uint256,bytes32,uint256)",
}

export interface ILevelUp {
  account: string;
  tokenId: string;
  attribute: string;
  value: string;
}

// OPENSEA ERC4906
// event MetadataUpdate(uint256 _tokenId);
export interface IMetadataUpdate {
  _tokenId: string;
}

// event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);
export interface IBatchMetadataUpdate {
  _fromTokenId: string;
  _toTokenId: string;
}

export type TDiscreteEvents = ILevelUp | IMetadataUpdate | IBatchMetadataUpdate;
