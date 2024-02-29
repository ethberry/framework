import { IAssetDto, RentRuleStatus } from "@framework/types";

export interface IRentUpdateDto {
  title: string;
  contractId: number;
  price: IAssetDto;
  rentStatus: RentRuleStatus;
}
