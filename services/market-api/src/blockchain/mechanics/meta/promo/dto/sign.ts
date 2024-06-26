import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@gemunion/nest-js-validators";
import { IPromoSignDto } from "@framework/types";

export class PromoSignDto extends Mixin(ReferrerOptionalDto) implements IPromoSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public promoId: number;

  public chainId: number;
  public account: string;
}
