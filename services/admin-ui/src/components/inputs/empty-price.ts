import { IAsset, IAssetComponent, TokenType } from "@framework/types";

export const emptyPrice = {
  components: [
    {
      tokenType: TokenType.NATIVE,
      contractId: 0,
      tokenId: 0,
      // token: {
      //   template: {
      //     title: "",
      //   },
      // },
      amount: "0",
    } as IAssetComponent,
  ],
} as IAsset;
