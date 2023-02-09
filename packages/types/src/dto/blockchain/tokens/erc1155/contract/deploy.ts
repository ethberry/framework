import { Erc1155ContractTemplates } from "../../../../../entities";

export interface IErc1155ContractDeployDto {
  contractTemplate: Erc1155ContractTemplates;
  baseTokenURI: string;
  royalty: number;
}
