import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IVestingClaimUploadDto } from "../interfaces";
import { VestingClaimCreateDto } from "./create";

export class VestingClaimUploadDto implements IVestingClaimUploadDto {
  @ApiProperty({
    isArray: true,
    type: VestingClaimCreateDto,
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => VestingClaimCreateDto)
  public claims: Array<VestingClaimCreateDto>;
}
