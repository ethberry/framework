import { Erc721ContractTemplates } from "../../../../../entities";

export interface IErc721ContractDeployDto {
  contractTemplate: Erc721ContractTemplates;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
