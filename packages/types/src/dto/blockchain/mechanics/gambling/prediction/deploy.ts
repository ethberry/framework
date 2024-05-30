import { PredictionContractTemplates } from "../../../../../entities";

export interface IPredictionContractDeployDto {
  contractTemplate: PredictionContractTemplates;
  payees: Array<string>;
  shares: Array<number>;
}
