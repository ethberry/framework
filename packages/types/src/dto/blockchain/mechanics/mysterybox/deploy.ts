import { MysteryContractTemplates } from "../../../../entities";

export interface IMysteryContractDeployDto {
  contractTemplate: MysteryContractTemplates;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
