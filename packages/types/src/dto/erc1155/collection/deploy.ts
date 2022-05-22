import { Erc1155TokenTemplate } from "../../../entities";

export interface IErc1155CollectionDeployDto {
  contractTemplate: Erc1155TokenTemplate;
  baseTokenURI: string;
}
