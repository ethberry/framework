import { IAsset, IAssetComponent, TokenType } from "@framework/types";

export const emptyPrice = {
  components: [
    {
      tokenType: TokenType.NATIVE,
      contractId: 0,
      contract: {
        decimals: 18,
      },
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
      contract: {
        decimals: 0,
        address: "0x",
      },
      templateId: 0,
      amount: "0",
    } as IAssetComponent,
  ],
} as IAsset;
