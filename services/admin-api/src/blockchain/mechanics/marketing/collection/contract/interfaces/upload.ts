export interface ITokenUploadDto {
  tokenId: bigint;
  imageUrl: string;
  metadata: string;
}

export class ICollectionUploadDto {
  public tokens: Array<ITokenUploadDto>;
}
