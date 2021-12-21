import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsNumber, IsString, Min } from "class-validator";

import { IPromoCreateDto } from "../interfaces";

export class PromoCreateDto implements IPromoCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsNumber({}, { message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public productId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;
}
