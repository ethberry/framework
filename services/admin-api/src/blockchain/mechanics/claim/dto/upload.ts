import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { ClaimItemCreateDto } from "./create";

export class ClaimUploadDto {
  @ApiProperty({
    isArray: true,
    type: ClaimItemCreateDto,
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => Array<ClaimItemCreateDto>)
  public files: Array<ClaimItemCreateDto>;
}
