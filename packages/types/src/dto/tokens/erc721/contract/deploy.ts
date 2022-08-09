import { Erc721ContractFeatures } from "../../../../entities";

export interface IErc721ContractDeployDto {
  contractFeatures: Array<Erc721ContractFeatures>;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
