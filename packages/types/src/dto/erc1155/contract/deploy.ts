import { Erc1155ContractTemplate } from "../../../entities";

export interface IContractDeployDto {
  contractTemplate: Erc1155ContractTemplate;
  baseTokenURI: string;
}
