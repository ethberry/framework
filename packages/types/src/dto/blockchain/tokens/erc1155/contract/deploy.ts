import { Erc1155ContractFeatures } from "../../../../../entities";

export interface IErc1155ContractDeployDto {
  contractFeatures: Array<Erc1155ContractFeatures>;
  baseTokenURI: string;
  royalty: number;
}
