import { CollectionContractTemplates } from "../../../../entities";

export interface ICollectionContractDeployDto {
  contractTemplate: CollectionContractTemplates;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
  batchSize: number;
}
