import { Erc998ContractTemplates } from "../../../../../entities";

export interface IErc998ContractDeployDto {
  contractTemplate: Erc998ContractTemplates;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
