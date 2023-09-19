import { TokenStatus } from "../../../../entities";

export interface ITokenAutocompleteDto {
  contractIds: Array<number>;
  templateIds: Array<number>;
  tokenStatus: Array<TokenStatus>;

  chainId: number;
  merchantId: number;
}
