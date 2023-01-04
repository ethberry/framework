import { Erc721CollectionFeatures } from "../../../../entities";

export interface IErc721CollectionDeployDto {
  contractFeatures: Array<Erc721CollectionFeatures>;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
  batchSize: number;
}
