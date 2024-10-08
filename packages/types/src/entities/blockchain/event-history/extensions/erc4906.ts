export enum Erc4906EventType {
  MetadataUpdate = "MetadataUpdate",
  BatchMetadataUpdate = "BatchMetadataUpdate",
}

export enum Erc4906EventSignature {
  MetadataUpdate = "MetadataUpdate(uint256)",
  BatchMetadataUpdate = "BatchMetadataUpdate(uint256,uint256)",
}

export interface IErc4906MetadataUpdateEvent {
  _tokenId: string;
}

export interface IErc4906BatchMetadataUpdateEvent {
  _fromTokenId: string;
  _toTokenId: string;
}

export type TErc4906Events = IErc4906MetadataUpdateEvent | IErc4906BatchMetadataUpdateEvent;
