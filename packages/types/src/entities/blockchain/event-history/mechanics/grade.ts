// event LevelUp(address from, uint256 tokenId, uint256 grade);
export interface ILevelUp {
  from: string;
  tokenId: string;
  grade: string;
}

// OPENSEA ERC4906
export interface IMetadataUpdate {
  _tokenId: string;
}

export type TUpgradeEvents = ILevelUp | IMetadataUpdate;
