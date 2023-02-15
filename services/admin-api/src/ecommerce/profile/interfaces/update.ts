import { IUserCommonDto } from "@framework/types";

export interface IProfileUpdateDto extends IUserCommonDto {
  chainId: number;
}
