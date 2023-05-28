import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IClaimItemUploadDto } from "../interfaces/upload";
import { ClaimItemCreateDto } from "./create";

export class ClaimItemUploadDto implements IClaimItemUploadDto {
  @ApiProperty({
    isArray: true,
    type: ClaimItemCreateDto,
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => ClaimItemCreateDto)
  public claims: Array<ClaimItemCreateDto>;
}
