import type { IToken } from "../provider";
import { useOneInch } from "../provider";

export const useAllTokens = (): Array<IToken> => {
  const oneInch = useOneInch();
  return oneInch.getAllTokens();
};
