import { ContractStatus } from "../../../../../entities";

export interface IWaitListListAutocompleteDto {
  contractStatus: Array<ContractStatus>;
  isRewardSet: boolean;
}
