import { ApiProperty } from "@nestjs/swagger";
import { IsJSON } from "class-validator";

import { IsNumber, IsString } from "@gemunion/nest-js-validators";

import { IPromoCreateDto } from "../interfaces";

export class PromoCreateDto implements IPromoCreateDto {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsNumber({
    minimum: 1,
  })
  public productId: number;

  @ApiProperty()
  @IsString()
  public imageUrl: string;
}
