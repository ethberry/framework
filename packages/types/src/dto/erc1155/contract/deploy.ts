import { Erc1155ContractTemplate } from "../../../entities";

export interface IErc1155CollectionDeployDto {
  contractTemplate: Erc1155ContractTemplate;
  baseTokenURI: string;
}
