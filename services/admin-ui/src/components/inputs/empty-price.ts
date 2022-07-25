import { IAsset, IAssetComponent, TokenType } from "@framework/types";

export const emptyPrice = {
  components: [
    {
      tokenType: TokenType.NATIVE,
      contractId: 0,
      templateId: 0,
      amount: "0",
    } as IAssetComponent,
  ],
} as IAsset;

export const emptyItem = {
  components: [
    {
      tokenType: TokenType.ERC721,
      contractId: 3,
      templateId: 0,
      amount: "0",
    } as IAssetComponent,
  ],
} as IAsset;
