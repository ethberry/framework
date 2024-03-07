import type { IClaimCreateDto } from "./create";

export interface IClaimUpdateDto extends Omit<IClaimCreateDto, "claimType"> {}
