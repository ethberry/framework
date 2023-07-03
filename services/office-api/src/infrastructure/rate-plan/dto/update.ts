import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IRatePlanRowUpdateDto, IRatePlanUpdateDto } from "../interfaces";

export class RatePlanRowUpdateDto implements IRatePlanRowUpdateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public ratePlanId: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public amount: number;
}

export class RatePlanUpdateDto implements IRatePlanUpdateDto {
  @ApiProperty({
    type: RatePlanRowUpdateDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested()
  @Type(() => RatePlanRowUpdateDto)
  public list: Array<RatePlanRowUpdateDto>;
}
