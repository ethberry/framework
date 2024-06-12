import { LootContractTemplates } from "../../../../../entities";

export interface ILootContractDeployDto {
  contractTemplate: LootContractTemplates;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
