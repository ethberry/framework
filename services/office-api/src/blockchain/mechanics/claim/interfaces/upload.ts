import type { IClaimItemCreateDto } from "@framework/types";

export interface IClaimItemUploadDto {
  claims: Array<IClaimItemCreateDto>;
}
