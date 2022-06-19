import { Erc998TokenTemplate } from "../../../entities";

export interface IErc998CollectionDeployDto {
  contractTemplate: Erc998TokenTemplate;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
