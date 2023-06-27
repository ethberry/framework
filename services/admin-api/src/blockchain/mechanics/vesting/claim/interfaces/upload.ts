import { IVestingClaimCreateDto } from "./create";

export interface IVestingClaimUploadDto {
  claims: Array<IVestingClaimCreateDto>;
}
