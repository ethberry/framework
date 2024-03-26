import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { IPromoSearchDto } from "@framework/types";

export class PromoSearchDto extends SearchDto implements IPromoSearchDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public merchantId: number;
}
