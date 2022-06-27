import { Erc998ContractTemplate } from "../../../entities";

export interface IErc998CollectionDeployDto {
  contractTemplate: Erc998ContractTemplate;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
