export interface ITokenUploadDto {
  tokenId: string;
  imageUrl: string;
  metadata: string;
}

export class ICollectionUploadDto {
  public tokens: Array<ITokenUploadDto>;
}
