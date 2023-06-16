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
