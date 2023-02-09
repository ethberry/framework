import { Erc721CollectionTemplates } from "../../../../entities";

export interface IErc721CollectionDeployDto {
  contractTemplate: Erc721CollectionTemplates;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
  batchSize: number;
}
