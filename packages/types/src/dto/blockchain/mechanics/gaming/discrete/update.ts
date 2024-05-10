import { IAssetDto } from "../../../exchange";
import { DiscreteStatus, DiscreteStrategy } from "../../../../../entities";

export interface IDiscreteUpdateDto {
  discreteStrategy: DiscreteStrategy;
  discreteStatus: DiscreteStatus;
  growthRate: number;
  price: IAssetDto;
}
