import { Erc1155ContractTemplate } from "../../../entities";

export interface IUniContractDeployDto {
  contractTemplate: Erc1155ContractTemplate;
  baseTokenURI: string;
}
