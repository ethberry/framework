import { PonziRuleStatus } from "@framework/types";

export interface IPonziRuleAutocompleteDto {
  ponziRuleStatus: Array<PonziRuleStatus>;
  ponziId: number;
}
