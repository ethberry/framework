import { MysteryboxContractFeatures } from "../../../../entities";

export interface IMysteryboxContractDeployDto {
  contractFeatures: Array<MysteryboxContractFeatures>;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
