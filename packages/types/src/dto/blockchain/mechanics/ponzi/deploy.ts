import { PonziContractTemplates } from "../../../../entities";

export interface IPonziContractDeployDto {
  contractTemplate: PonziContractTemplates;
  payees: Array<string>;
  shares: Array<number>;
}
