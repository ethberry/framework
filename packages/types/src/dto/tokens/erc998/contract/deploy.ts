import { Erc998ContractFeatures } from "../../../../entities";

export interface IErc998ContractDeployDto {
  contractFeatures: Array<Erc998ContractFeatures>;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
