import type { IPonziRule } from "@framework/types";

export interface IPonziRuleCreatedData {
  ponziRule: IPonziRule;
  address: string;
  transactionHash: string;
}
