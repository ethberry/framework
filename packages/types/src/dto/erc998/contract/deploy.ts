import { Erc998ContractTemplate } from "../../../entities";

export interface IErc998ContractDeployDto {
  contractTemplate: Erc998ContractTemplate;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
