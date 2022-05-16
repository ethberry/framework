import { Erc1155TokenTemplate } from "../../../entities";

export interface IErc1155TokenDeployDto {
  contractTemplate: Erc1155TokenTemplate;
  baseTokenURI: string;
}
