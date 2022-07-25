import { emptyStateString } from "@gemunion/draft-js-utils";
import { IAsset, IAssetComponent, TokenType } from "@framework/types";

export const emptyPrice = {
  components: [
    {
      id: 0,
      tokenType: TokenType.NATIVE,
      contractId: 0,
      contract: {
        decimals: 18,
        symbol: "",
      },
      templateId: 0,
      template: {
        title: "",
        description: emptyStateString,
      },
      amount: "0",
    } as IAssetComponent,
  ],
} as IAsset;

export const emptyItem = {
  components: [
    {
      id: 0,
      tokenType: TokenType.ERC721,
      contractId: 3,
      contract: {
        decimals: 18,
        symbol: "",
      },
      templateId: 0,
      template: {
        title: "",
        description: emptyStateString,
      },
      amount: "0",
    } as IAssetComponent,
  ],
} as IAsset;
