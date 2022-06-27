import { Erc721ContractTemplate } from "../../../entities";

export interface IErc721ContractDeployDto {
  contractTemplate: Erc721ContractTemplate;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
