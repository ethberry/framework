import { PyramidRuleStatus } from "@framework/types";

export interface IPyramidRuleAutocompleteDto {
  pyramidRuleStatus: Array<PyramidRuleStatus>;
  pyramidId: number;
}
