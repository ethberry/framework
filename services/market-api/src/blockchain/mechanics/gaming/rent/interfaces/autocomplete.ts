import { RentRuleStatus } from "@framework/types";

export interface IRentAutocompleteDto {
  contractId?: number;
  rentStatus?: RentRuleStatus;
}
