import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";

import { IProfileUpdateDto } from "../interfaces";
import { UserCommonDto } from "../../../common/dto";

export class ProfileUpdateDto extends UserCommonDto implements IProfileUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public chainId: number;
}
