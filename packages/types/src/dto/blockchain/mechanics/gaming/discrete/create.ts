import { DiscreteStrategy } from "../../../../../entities";
import type { IAssetDto } from "../../../exchange";

export interface IDiscreteCreateDto {
  contractId: number;
  attribute: string;
  discreteStrategy: DiscreteStrategy;
  growthRate: number;
  price: IAssetDto;
}
