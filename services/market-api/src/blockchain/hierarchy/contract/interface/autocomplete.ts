import type { IContractAutocompleteDto } from "@framework/types";

// TODO this should not exist
export interface IContractAutocompleteExtDto extends IContractAutocompleteDto {
  contractId: number;
}
