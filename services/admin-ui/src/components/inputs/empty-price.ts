import { IAsset, IAssetComponent, TokenType } from "@framework/types";

export const emptyPrice = {
  components: [
    {
      tokenType: TokenType.NATIVE,
      uniContractId: 0,
      uniTokenId: 0,
      amount: "0",
    } as IAssetComponent,
  ],
} as IAsset;
