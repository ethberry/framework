import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import type { IRatePlanRowUpdateDto, IRatePlanUpdateDto } from "../interfaces";

export class RatePlanRowUpdateDto implements IRatePlanRowUpdateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public ratePlanId: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public amount: number;
}

export class RatePlanUpdateDto implements IRatePlanUpdateDto {
  @ApiProperty({
    type: RatePlanRowUpdateDto,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => RatePlanRowUpdateDto)
  public limits: Array<RatePlanRowUpdateDto>;
}
