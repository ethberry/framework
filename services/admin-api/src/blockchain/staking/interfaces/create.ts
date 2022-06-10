import { ItemType } from "@framework/types";

export interface IStakingItemCreateDto {
  itemType: ItemType;
  token: string;
  criteria: string;
  amount: string;
}

export interface IStakingCreateDto {
  title: string;
  description: string;
  deposit: IStakingItemCreateDto;
  reward: IStakingItemCreateDto;
  duration: string;
  penalty: number;
  recurrent: boolean;
}
