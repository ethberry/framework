import { IToken, useOneInch } from "../provider";

export const useAllTokens = (): Array<IToken> => {
  const oneInch = useOneInch();
  return oneInch.getAllTokens();
};
