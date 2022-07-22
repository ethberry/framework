import { Erc1155ContractTemplate } from "../../../entities";

export interface IErc1155ContractDeployDto {
  contractTemplate: Erc1155ContractTemplate;
  baseTokenURI: string;
  royalty: number;
}
