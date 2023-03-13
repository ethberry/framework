import { PyramidContractTemplates } from "../../../../entities";

export interface IPyramidContractDeployDto {
  contractTemplate: PyramidContractTemplates;
  payees: Array<string>;
  shares: Array<number>;
}
