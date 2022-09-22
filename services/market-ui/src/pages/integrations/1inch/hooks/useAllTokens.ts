import { IToken, useOneInch } from "@gemunion/provider-1inch";

export const useAllTokens = (): Array<IToken> => {
  const oneInch = useOneInch();
  return oneInch.getAllTokens();
};
