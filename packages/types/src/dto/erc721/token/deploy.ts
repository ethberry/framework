import { Erc721TokenTemplate } from "../../../entities";

export interface IErc721TokenDeployDto {
  contractTemplate: Erc721TokenTemplate;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
