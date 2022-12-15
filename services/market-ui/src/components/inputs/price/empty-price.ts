import { IAsset, IAssetComponent, TokenType } from "@framework/types";
import { imageUrl } from "@framework/constants";
import { emptyStateString } from "@gemunion/draft-js-utils";

export interface ITokenAssetComponent extends IAssetComponent {
  token: { tokenId?: string };
}

export interface ITokenAsset {
  components: Array<ITokenAssetComponent>;
}

export const emptyPrice = {
  components: [
    {
      tokenType: TokenType.NATIVE,
      contractId: 0,
      contract: {
        decimals: 18,
        contractType: TokenType.NATIVE,
      },
      templateId: 0,
      template: {
        title: "",
      },
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
      },
      templateId: 0,
      template: {
        imageUrl,
        description: emptyStateString,
      },
      amount: "0",
    } as IAssetComponent,
  ],
} as IAsset;

export const emptyItems = {
  components: [
    {
      tokenType: TokenType.NATIVE,
      contractId: 0,
      contract: {
        decimals: 18,
        contractType: TokenType.NATIVE,
      },
      templateId: 0,
      template: {
        title: "",
      },
      amount: "0",
      token: { tokenId: "0" },
    } as ITokenAssetComponent,
  ],
} as ITokenAsset;
