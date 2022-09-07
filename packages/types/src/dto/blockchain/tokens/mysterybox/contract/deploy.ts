import { MysteryContractFeatures } from "../../../../../entities";

export interface IMysteryContractDeployDto {
  contractFeatures: Array<MysteryContractFeatures>;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
