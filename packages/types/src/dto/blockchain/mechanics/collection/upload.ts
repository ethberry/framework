export interface ICollectionRowDto {
  id?: string;
  tokenId: string;
  imageUrl: string;
  metadata: string;
}

export interface ICollectionUploadDto {
  files: Array<File>;
  tokens: ICollectionRowDto[];
}
