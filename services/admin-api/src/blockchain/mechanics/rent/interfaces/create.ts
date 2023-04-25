import { IAssetDto, RentRuleStatus } from "@framework/types";

export interface IRentCreateDto {
  title: string;
  contractId: number;
  price: IAssetDto;
  rentStatus: RentRuleStatus;
}
