import { Erc20TokenStatus, Erc20TokenTemplate } from "../../../entities";

export interface IErc20TokenAutocompleteDto {
  tokenStatus: Array<Erc20TokenStatus>;
  contractTemplate: Array<Erc20TokenTemplate>;
}
