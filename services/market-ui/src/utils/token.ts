import { ITokenAsset } from "@gemunion/mui-inputs-asset";
import { IToken, TokenType } from "@framework/types";

export const formatTokenTitle = (token: IToken): string => {
  if (
    token.template?.contract?.contractType === TokenType.ERC721 ||
    token.template?.contract?.contractType === TokenType.ERC998
  ) {
    return `${token.template.title} #${token.tokenId}`;
  } else {
    return token.template!.title;
  }
};

export const computeTokenAsset = (token: IToken): any => {
  return {
    components: [
      {
        amount: "1",
        contract: {
          address: token.template!.contract!.address,
          decimals: token.template!.contract!.decimals,
        },
        contractId: token.template!.contract!.id,
        templateId: token.template!.id,
        tokenType: token.template!.contract!.contractType || TokenType.ERC721,
        token: {
          id: token.id,
          tokenId: token.tokenId,
        },
        tokenId: token.id,
      },
    ],
  };
};
